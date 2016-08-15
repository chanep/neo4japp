'use strict'
const _ = require('lodash');
const errors = require('../shared/errors');
const neo4j = require('neo4j-driver').v1;
const queryHelper = require('./query-helper');


class CypherHelper {
    constructor(model){
        this.model = model;
    }
    findByIdCmd(id, includes){
        includes = this.parseIncludes(includes, this.model, 'n');
        let query = {id: id, includes: includes};
        let params = {};
        let match = this.getMatch(query, params);
        let ret = this.getReturn(includes);
        let cmd = `${match}
                    ${ret}`;
        return  {cmd:cmd, params:params};
    }
    findCmd(query){
        query = this.parseQuery(query);
        let params = {};
        let match = this.getMatch(query, params);
        let with_ = this.getWith(query.includes);
        let ret = this.getReturn(query.includes);
        let cmd = `${match}
                    ${with_}
                    ${ret}`;
        return {cmd:cmd, params:params};
    }
    createCmd(data){
        let cmd = `CREATE (n:${this.model.labelsStr} {data}) 
                   RETURN n`
        let params = {data: this.convertToNative(data, this.model.schema)};
        return  {cmd:cmd, params:params};
    }
    updateCmd(data, mergeKeys){
        let operator = mergeKeys? '+=' : '=';
        let cmd = `MATCH (n:${this.model.labelsStr}) WHERE ID(n) = {id} 
                      SET n ${operator} {data}
                        RETURN n`;
        let dataAux = _.omit(data, ["id"]);
        let params = {id: neo4j.int(data.id), data: this.convertToNative(dataAux, this.model.schema)};
        return  {cmd:cmd, params:params};
    }
    deleteCmd(id, force){
        let cmd = `
            MATCH (n:${this.model.labelsStr}) WHERE ID(n) = {id} 
            DELETE n
            RETURN count(n) as affected`;
        if(force){
            cmd = `
                MATCH (n:${this.model.labelsStr}) WHERE ID(n) = {id} 
                OPTIONAL MATCH (n:${this.model.labelsStr})-[r]-() WHERE ID(n) = {id} 
                DELETE n,r
                RETURN count(n) as affected`;
        }
        let params = {id: id};
        return  {cmd:cmd, params:params};;
    }
    deleteAllCmd(){
        let cmd = `
                MATCH (n:${this.model.labelsStr}) 
                OPTIONAL MATCH (n:${this.model.labelsStr})-[r]-() 
                DELETE n,r
                RETURN count(n) as affected`;
        let params = {};
        return  {cmd:cmd, params:params};;
    }
    relateCmd(id, otherId, relKey, relData, replace){
        let r = this.model.getRelationByKey(relKey);

        let dir1 = '';
        let dir2 = '>';
        if(!r.outgoing){
            dir1 = '<';
            dir2 = '';
        }

        relData = relData || {};
        // let relDataStr = this.mapToStr(relData, "relData");
        // let cmd = `
        //     MATCH (n:${this.model.labelsStr}),(m)
        //     WHERE ID(n) = {id} AND ID(m) = {otherId}
        //     MERGE (n)${dir1}-[r:${r.label} ${relDataStr}]-${dir2}(m)
        //     RETURN r`;
        let unique = ''
        if(replace)
            unique = 'UNIQUE ';
        
        let cmd = `
            MATCH (n:${this.model.labelsStr}),(m:${r.model.labelsStr})
            WHERE ID(n) = {id} AND ID(m) = {otherId}
            CREATE ${unique}(n)${dir1}-[r:${r.label}]-${dir2}(m)
            SET r = {relData}
            RETURN r`;
        
        let params = {id: neo4j.int(id), otherId: neo4j.int(otherId), relData: relData};

        return  {cmd:cmd, params:params};;
    }
    createAndRelateCmd(data, otherId, relKey, relData){
        let r = this.model.getRelationByKey(relKey);
        let dir1 = '';
        let dir2 = '>';
        if(!r.outgoing){
            dir1 = '<';
            dir2 = '';
        }

        relData = relData || {};
        let cmd = `
            MATCH (m:${r.model.labelsStr}) WHERE ID(m) = {otherId}
            CREATE (n:${this.model.labelsStr} {data})${dir1}-[r:${r.label} {relData}]-${dir2}(m)
            RETURN n`
        let params = {otherId: neo4j.int(otherId), data: this.convertToNative(data, this.model.schema), relData: this.convertToNative(relData, r.schema)};
        return  {cmd:cmd, params:params};;
    }
    parseResult(result){
        var nodes = this.parseResultArray(result);
        if(nodes.length == 0){
            return null;
        } else if(nodes.length == 1){
            return nodes[0];
        } else{
            return nodes;
        }
    }
    parseResultRaw(result, schema){
        var nodes = this.parseResultArrayRaw(result, schema);
        if(nodes.length == 0){
            return null;
        } else if(nodes.length == 1){
            return nodes[0];
        } else{
            return nodes;
        }
    }
    parseResultArrayRaw(result, schema){
        var nodes = [];
        if(_.isUndefined(schema))
            schema = this.model.schema
        result.records.forEach(r => {
            let f = r._fields[0];
            let n = this.parseFieldRaw(f, schema);
            nodes.push(n);
        })
        return nodes;
    }
    parseResultArray(result){
        var nodes = [];
        result.records.forEach(r => {
            let f = r._fields[0];
            let n = this.parseModelField(f, this.model);
            nodes.push(n);
        })
        return nodes;
    }
    parseResultAffected(result){
        return this.getInt(result.records[0]._fields[0]);
    }
    parseModelField(f, model){
        if(!f)
            return null;
        if(this.isNodeField(f))
            return this.parseNodeField(f, model.schema);
        let parsed = this.parseField(f, model.schema);
        for(let k in f){
            if(parsed[k])
                continue;
            if(this.isRelationship(model, k)){
                let r = model.getRelationByKey(k);
                if(r.type == 'one'){
                    parsed[k] = this.parseRelationshipField(f[k], r);
                } else{
                    parsed[k] = f[k].map(fi => this.parseRelationshipField(fi, r));
                }
            }
        }
        return parsed;
    }
    parseRelationshipField(f, r){
        let parsed = {};
        if(r.schema){
            parsed = this.parseField(f, r.schema);
            let modelKey = r.model.name.toLowerCase();
            parsed[modelKey] = this.parseModelField(f[modelKey], r.model);
        } else{
            parsed = this.parseModelField(f, r.model);
        }
        return parsed;
    }
    isRelationship(model, key){
        return !!(_.find(model.relationships, {key: key}));
    }
    parseField(f, schema){
        let parsed = {};
        for(let k in schema){
            if(!f[k])
                continue;
            if(k == 'id'){
                parsed.id = this.getInt(f[k]);
            } else{
                let type = schema[k]._type;
                parsed[k] = this.convertFromNativeValue(f[k], type);
            }  
        }
        return parsed;
    }
    parseNodeField(f, schema){
        let parsed = {};
        parsed.id = this.getInt(f.identity);
        for(let k in f.properties){
            let type = null;
            if(schema && schema[k])
                type = schema[k]._type;
            parsed[k] = this.convertFromNativeValue(f.properties[k], type);
        }
        return parsed;
    }
    parseFieldRaw(f, schema){
        let parsed = {};
        if(this.isNodeField(f)){
            return this.parseNodeField(f, schema);
        } else{
            for(let k in f){
                if(k == 'id')
                    parsed.id = this.getInt(f[k]);
                let value = f[k];
                if(_.isArray(v)){
                    parsed[k] = v.map(i => this.parseFieldRaw(v));
                } else if(_.isObject(v)){
                    parsed[k] = this.parseFieldRaw(v);
                } else{
                    parsed[k] = v;
                }
            }
        }

        return parsed;
    }
    convertFromNativeValue(value, type){
        if(!value || !type)
            return value;
        switch(type){
            case "date":
                return new Date(value);
            case "object":
                return JSON.parse(value);
            default:
                return value;                 
        } 
    }
    isNodeField(f){
        return (f.identity && f.properties);
    }
    getInt(identity){
        return identity.low;
    }
    getMatch(query, params){
        let alias = 'n';
        let match = `MATCH (${alias}${this.labels(this.model)})`;
        
        let rootQuery = this.getRootQuery(query);
        match += ' WHERE ' + queryHelper.queryMapToCypher(this.model, rootQuery, alias, params);
        
        query.includes.forEach(include => {
            match += '\n' + this.includeToMatch(include, params);
        });
        return match;
    }
    includeToMatch(include, params){
        let i = include;
        let optional = '';
        if(!i.hasQuery)
            optional = 'OPTIONAL ';
        let match = `${optional}MATCH (${i.sourceAlias})`;
        let rel;
        if(i.r.outgoing){
            rel = `-[${i.relAlias}:${i.r.label}]->`;
        }else {
            rel = `<-[${i.relAlias}:${i.r.label}]-`;
        }
        match += rel + `(${i.destAlias}) `;

        match += queryHelper.queryIncludeToCypher(include, params);

        i.includes.forEach(include => {
            match += '\n' + this.includeToMatch(include, params);
        });
        return match;
    }
    getWith(includes){
        let alias = 'n';
        let cypher = `WITH ${alias}`;
        includes.forEach(include => {
            cypher += this.includeToWith(include);
        });
        return cypher;
    }
    includeToWith(include){
        let i = include;

        let cypher = "";
        if(i.r.schema)
            cypher += ', ' + i.relAlias;

        cypher += ', ' + i.destAlias;

        i.includes.forEach(include => {
            cypher += this.includeToWith(include);
        });
        return cypher;
    }
    getReturn(includes){
        let ret = `RETURN `;
        ret += this.modelToMapStr(this.model, includes, 'n');
        return ret;
    }
    modelToMapStr(model, includes, alias){
        let map = `{`;
        map += this.mapToStr(model.schema, alias);

        includes.forEach(include => {
            if(!include.notInclude)
                map += ', ' + this.includeToMapStr(include);
        })

        map += `}`;
        return map;
    }
    includeToMapStr(include){
        let i = include;
        let map = `${i.r.key}: `;
        let innerMap = '';

        let modelMap = this.modelToMapStr(i.r.model, i.includes, i.destAlias);

        if(i.r.schema){  
            innerMap += '{';
            innerMap += this.mapToStr(i.r.schema, `${i.relAlias}`);
            innerMap += `, ${i.r.model.name.toLowerCase()}: ${modelMap}`;
            innerMap += '}';
        } else{
            innerMap += modelMap;
        }

        if(i.r.type == 'many'){
            map += `COLLECT(${innerMap})`;
        } else{
            map += `${innerMap}`
        }

        return map;

    }

    mapToStr(map, alias){
        let terms = [];
        for(let k in map){
            if(k == 'id'){
                terms.push(`id: ID(${alias})`)
            } else{
                terms.push(`${k}: ${alias}.${k}`);
            }       
        }
        return terms.join(', ');
    }
    labels(model){
        let aux = [""].concat(model.labels);
        return aux.join(':');
    }
    parseQuery(query){
        if(!query)
            return query;
        let parsed = _.clone(query);
        parsed.includes = this.parseIncludes(query.includes, this.model, 'n');
        return parsed;
    }
    getRootQuery(query){
        return _.omit(query, ["includes", "paged", "orderBy"]);
    }
    parseIncludes(includes, model, sourceAlias){
        if(!includes)
            return [];
        let parsedIncludes = [];
        let i = 1;
        includes.forEach(include => {
            i++;
            let parsed = this.parseInclude(include, model, sourceAlias, i);
            parsedIncludes.push(parsed);
        })
        let sorted = _.sortBy(parsedIncludes, inc => {
            if(inc.hasQuery)
                return 0;
            return 1;
        });
        return sorted;
    }
    parseInclude(include, model, sourceAlias, index){
        if(include && (typeof include === 'string'))
            include = {key: include, includes: []};

        if(!include.includes)
            include.includes = [];
            
        include.sourceAlias = sourceAlias;
        include.destAlias = sourceAlias + index;
        include.relAlias = include.sourceAlias + include.destAlias;
        let r = model.getRelationByKey(include.key);
        include.r = r;
        if(r.schema){
            include.dataAlias = include.relAlias;
        } else{
            include.dataAlias = include.destAlias;
        }
        include.includes = this.parseIncludes(include.includes, r.model, include.destAlias);
        include.hasQuery = this.includeHasQuery(include);
        return include;
    }
    includeHasQuery(include){
        let i = include;
        let has = false;
        if(i.query || i.relQuery)
            return true;
        for(let si of i.includes){
            if(this.includeHasQuery(si))
                return true;
        }
        return false;
    }

    convertToNative(data, schema){
        if(!schema)
            return data;
        let nativeData = _.clone(data);
        for(let k in schema){
            let type = schema[k]._type;
            switch (type) {
                case "date":
                    if(data[k])
                        nativeData[k] = data[k].getTime();
                    break;
                case "object":
                    if(data[k])
                        nativeData[k] = JSON.stringify(data[k]);
                    break;
            }
        }
        return nativeData;
    }
}

module.exports = CypherHelper;