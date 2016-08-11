'use strict'
const _ = require('lodash');
const errors = require('../shared/errors');
const neo4j = require('neo4j-driver').v1;


class CypherHelper {
    constructor(model){
        this.model = model;
        let aux = [""].concat(this.model.labels);
        this._labelsCypher = aux.join(':');
    }
    findByIdCmd(id, includes){
        includes = this.parseIncludes(includes);
        let match = this.getMatch(includes);
        let ret = this.getReturn(includes);
        let cmd = `${match}
                    WHERE ID(n) = {id}
                    ${ret}`;
        let params = {id: id};
        return [cmd, params];
    }
    findCmd(query){
        let includes = [];
        if(query)
            includes = this.parseIncludes(query.includes);
        let where = this.getWhere(query);
        let match = this.getMatch(includes);
        let ret = this.getReturn(includes);
        let cmd = `${match}
                    ${where}
                    ${ret}`;
        return [cmd, {}];
    }
    createCmd(data){
        let cmd = `CREATE (n${this._labelsCypher} {data}) 
                   RETURN n`
        let params = {data: this.convertToNative(data, this.model.schema)};
        return [cmd, params];
    }
    updateCmd(data, mergeKeys){
        let operator = mergeKeys? '+=' : '=';
        let cmd = `MATCH (n${this._labelsCypher}) WHERE ID(n) = {id} 
                      SET n ${operator} {data}
                        RETURN n`;
        let dataAux = _.omit(data, ["id"]);
        let params = {id: data.id, data: this.convertToNative(dataAux, this.model.schema)};
        return [cmd, params];
    }
    deleteCmd(id, force){
        let cmd = `
            MATCH (n${this._labelsCypher}) WHERE ID(n) = {id} 
            DELETE n
            RETURN count(n) as affected`;
        if(force){
            cmd = `
                MATCH (n${this._labelsCypher}) WHERE ID(n) = {id} 
                OPTIONAL MATCH (n${this._labelsCypher})-[r]-() WHERE ID(n) = {id} 
                DELETE n,r
                RETURN count(n) as affected`;
        }
        let params = {id: id};
        return [cmd, params];
    }
    deleteAllCmd(){
        let cmd = `
                MATCH (n${this._labelsCypher}) 
                OPTIONAL MATCH (n${this._labelsCypher})-[r]-() 
                DELETE n,r
                RETURN count(n) as affected`;
        let params = {};
        return [cmd, params];
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
        //     MATCH (n${this._labelsCypher}),(m)
        //     WHERE ID(n) = {id} AND ID(m) = {otherId}
        //     MERGE (n)${dir1}-[r:${r.label} ${relDataStr}]-${dir2}(m)
        //     RETURN r`;
        let unique = ''
        if(replace)
            unique = 'UNIQUE ';
        
        let cmd = `
            MATCH (n${this._labelsCypher}),(m)
            WHERE ID(n) = {id} AND ID(m) = {otherId}
            CREATE ${unique}(n)${dir1}-[r:${r.label}]-${dir2}(m)
            SET r = {relData}
            RETURN r`;
        
        let params = {id: neo4j.int(id), otherId: neo4j.int(otherId), relData: relData};

        return [cmd, params];
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
            MATCH (m) WHERE ID(m) = {otherId}
            CREATE (n${this._labelsCypher} {data})${dir1}-[r:${r.label} {relData}]-${dir2}(m)
            RETURN n`
        let params = {otherId: neo4j.int(otherId), data: this.convertToNative(data, this.model.schema), relData: this.convertToNative(relData, r.schema)};
        return [cmd, params];
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
            return this.parseNodeField(f);
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
                parsed[k] = this.convertFromNativeValue(f[k]);
            }  
        }
        return parsed;
    }
    parseNodeField(f){
        let parsed = {};
        parsed.id = this.getInt(f.identity);
        for(let k in f.properties){
            parsed[k] = this.convertFromNativeValue(f.properties[k]);
        }
        return parsed;
    }
    convertFromNativeValue(value, type){
        if(!value)
            return value;
        switch(type){
            case "date":
                return new Date(f[k]);
            case "object":
                return JSON.parse(f[k]);
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
    getMatch(includes){
        let alias = 'n';
        let match = `MATCH (${alias}${this.labels(this.model)})`;
        let i = 1;
        includes.forEach(include => {
            i++;
            let r = this.model.getRelationByKey(include.key);
            match += '\n' + this.includeToMatch(r, include.includes, `${alias}`, `${alias}${i}`);
        });
        return match;
    }
    includeToMatch(r, includes, alias, otherAlias){
        let match = `OPTIONAL MATCH (${alias})`;
        let rel;
        if(r.outgoing){
            rel = `-[${alias}r:${r.label}]->`;
        }else {
            rel = `<-[${alias}r:${r.label}]-`;
        }
        match += rel + `(${otherAlias})`
        let i = 1;
        includes.forEach(include => {
            i++;
            let r2 = r.model.getRelationByKey(include.key);
            match += '\n' + this.includeToMatch(r2, include.includes, `${otherAlias}`, `${otherAlias}${i}`);
        });
        return match;
    }
    getWhere(query, alias){
        if(!query)
            return "";
        query = _.omit(query, ["includes"]);
        alias = alias || 'n'; 
        let conditions = [];
        for(let k in query){
            let value = query[k];
            if(typeof value === 'string' && value.indexOf('*') >= 0){
                value = value.replace(/\*/g, '.*');
                conditions.push(`${alias}.${k} =~ '(?i)${value}'`);
            } else if(typeof value === 'string'){
                conditions.push(`${alias}.${k} = '${value}'`);
            } else{
                conditions.push(`${alias}.${k} = ${value}`);
            }
        }

        let cypher = " WHERE " + conditions.join(' AND ');
        return cypher;
    }
    getReturn(includes){
        let ret = `RETURN `;
        ret += this.modelToMapStr(this.model, includes, 'n');
        return ret;
    }
    includeToMapStr(r, includes, alias, otherAlias){
        let map = `${r.key}: `;
        let innerMap = '';

        let modelMap = this.modelToMapStr(r.model, includes, otherAlias);

        if(r.schema){  
            innerMap += '{';
            innerMap += this.mapToStr(r.schema, `${alias}r`);
            innerMap += `, ${r.model.name.toLowerCase()}: ${modelMap}`;
            innerMap += '}';
        } else{
            innerMap += modelMap;
        }

        if(r.type == 'many'){
            map += `COLLECT(${innerMap})`;
        } else{
            map += `${innerMap}`
        }

        return map;

    }
    modelToMapStr(model, includes, alias){
        let map = `{`;
        map += this.mapToStr(model.schema, alias);
        let i = 1;
        includes.forEach(include => {
            i++;
            let r = model.getRelationByKey(include.key);
            map += ', ' + this.includeToMapStr(r, include.includes, alias, alias + i);
        })

        map += `}`;
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
    parseIncludes(includes){
        if(!includes)
            return [];
        return includes.map(i => this.parseInclude(i));
    }
    parseInclude(include){
        if(include && (typeof include === 'string')){
            return {key: include, includes: []}
        } else{
            return {key: include.key, includes: this.parseIncludes(include.includes)};
        }
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