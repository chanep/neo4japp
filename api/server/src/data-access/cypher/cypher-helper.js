'use strict'
const _ = require('lodash');
const errors = require('../../shared/errors');
const whereHelper = require('./where-helper');
const resultParser = require('./result-parser');


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
        let orderBy = this.getOrderBy(query);
        let skipLimit = this.getSkipLimit(query, params);
        let cmd = `${match}\n${with_}\n${orderBy}\n${skipLimit}\n${ret}`;
        cmd = cmd.replace(/\n+/g, '\n');
        return {cmd:cmd, params:params};
    }
    countCmd(query){
        query = this.parseQuery(query);
        let params = {};
        let match = this.getMatch(query, params);
        let with_ = this.getWith(query.includes);
        let cmd = `${match}\n${with_}\nRETURN count(n) as count`;
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
        let params = {id: data.id, data: this.convertToNative(dataAux, this.model.schema)};
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
    relateCmd(id, otherId, relKey, relData, mergeKeys){
        let r = this.model.getRelationByKey(relKey);
        let relCypher = this._getRelationshipCypher(relKey, 'r');
        let oldRelCypher = this._getRelationshipCypher(relKey, 'oldr');

        relData = this.convertToNative(relData, r.schema) || {};
        let cmd;
        let operator = mergeKeys? '+=' : '=';
        if(r.isToOne()){
            cmd = `MATCH (n:${this.model.labelsStr}) where ID(n) = {id}
             MATCH (m:${r.model.labelsStr}) where ID(m) = {otherId}
             OPTIONAL MATCH (n)${oldRelCypher}(o:${r.model.labelsStr}) WHERE ID(m) <> ID(o)
             MERGE (n)${relCypher}(m)
             SET r ${operator} {relData}
             DELETE oldr
             RETURN r`;
        } else{
            let create = r.multiple ? 'CREATE' : 'MERGE';
            cmd = `MATCH (n:${this.model.labelsStr}) where ID(n) = {id}
             MATCH (m:${r.model.labelsStr}) where ID(m) = {otherId}
             ${create} (n)${relCypher}(m)
             SET r ${operator} {relData}
             RETURN r`;
        }
        
        let params = {id: id, otherId: otherId, relData: relData};

        return  {cmd:cmd, params:params};;
    }
    deleteRelationshipCmd(id, otherId, relKey){
        let r = this.model.getRelationByKey(relKey);
        let relCypher = this._getRelationshipCypher(relKey, 'r');

        let cmd = `MATCH (n)${relCypher}(m) WHERE ID(n) = {id} AND ID(m) = {otherId}
             DELETE r
             RETURN count(r)`;

        let params = {id: id, otherId: otherId};

        return  {cmd:cmd, params:params};;
    }
    updateRelationshipCmd(relId, relKey, relData, mergeKeys){
        let r = this.model.getRelationByKey(relKey);
        let relCypher = this._getRelationshipCypher(relKey, 'r');

        relData = this.convertToNative(relData, r.schema)  || {};
        let operator = mergeKeys? '+=' : '=';
        let cmd = `MATCH ()${relCypher}() where ID(r) = {relId}
             SET r ${operator} {relData}
             RETURN r`;

        let params = {relId: relId, relData: relData};

        return  {cmd:cmd, params:params};;
    }
    relationshipExistsCmd(selfId, relKey, otherId){
        let r = this.model.getRelationByKey(relKey);
        let label = this.model.labelsStr;
        let relCypher = this._getRelationshipCypher(relKey, 'r');

        let params = {id: selfId};
        let condition = ''
        if(otherId){
            params.otherId = otherId;
            condition = 'and id(m) = {otherId}'
        }

        let cmd = `match (n:${label})${relCypher}(m) 
            where id(n) = {id} ${condition}
            return (count(n) <> 0)`;

        return  {cmd:cmd, params:params};;
    }
    createAndRelateCmd(data, otherId, relKey, relData){
        let r = this.model.getRelationByKey(relKey);
        let relCypher = this._getRelationshipCypher(relKey, 'r', relData);
        relData = this.convertToNative(relData, r.schema) || {};
        let cmd = `
            MATCH (m:${r.model.labelsStr}) WHERE ID(m) = {otherId}
            CREATE (n:${this.model.labelsStr} {data})${relCypher}(m)
            RETURN n`
        let params = {otherId: otherId, data: this.convertToNative(data, this.model.schema), relData: this.convertToNative(relData, r.schema)};
        return  {cmd:cmd, params:params};;
    }
    deleteAllRelationshipsCmd(id, relKey){
        let relCypher = this._getRelationshipCypher(relKey, 'r');
        let cmd = `
                MATCH (n:${this.model.labelsStr})${relCypher}() WHERE ID(n) = {id}
                DELETE r
                RETURN count(n) as affected`;
        let params = {id: id};
        return  {cmd:cmd, params:params};;
    }
    setChildCmd(selfId, relKey, childData){
        let r = this.model.getRelationByKey(relKey);
        let relCypher = this._getRelationshipCypher(relKey, 'r', null);
        childData = _.omit(childData, ["id"]);
        let cmd = `
            MATCH (n:${this.model.labelsStr}) WHERE ID(n) = {selfId}
            MERGE (n)${relCypher}(m:${r.model.labelsStr})
            SET m = {childData} 
            RETURN m`
        let params = {selfId: selfId, childData: this.convertToNative(childData, r.model.schema)};
        return  {cmd:cmd, params:params};;
    }
    addChildCmd(selfId, relKey, childData){
        let r = this.model.getRelationByKey(relKey);
        let relCypher = this._getRelationshipCypher(relKey, 'r', null);

        let cmd = `
            MATCH (n:${this.model.labelsStr}) WHERE ID(n) = {selfId}
            CREATE (n)${relCypher}(m:${r.model.labelsStr} {childData})
            RETURN m`
        let params = {selfId: selfId, childData: this.convertToNative(childData, r.model.schema)};
        return  {cmd:cmd, params:params};;
    }
    updateChild(slefId, relKey, childData){
        let r = this.model.getRelationByKey(relKey);
        let relCypher = this._getRelationshipCypher(relKey, 'r', null);
        let childId = childData.id;
        let childDataAux = _.omit(data, ["id"]);
        let cmd = `
            MATCH (n:${this.model.labelsStr})${relCypher}(m:${r.model.labelsStr}) WHERE ID(n) = {selfId} AND ID(m) = {childId}
            SET m = {childDataAux} 
            RETURN m`
        let params = {selfId: selfId, childId: childId, childDataAux: this.convertToNative(childDataAux, r.model.schema)};
        return  {cmd:cmd, params:params};;
    }
    _getRelationshipCypher(relKey, relAlias, relData){
        let r = this.model.getRelationByKey(relKey);
        let dir1 = '';
        let dir2 = '>';
        if(!r.outgoing){
            dir1 = '<';
            dir2 = '';
        }
        let data = '';
        if(relData)
            data = ' {relData}';
        return `${dir1}-[${relAlias}:${r.label}${data}]-${dir2}`;
    }
    parseResult(result, model){
        model = model || this.model;
        return resultParser.parseResult(result, model);
    }
    parseResultArray(result, model){
        model = model || this.model;
        return resultParser.parseResultArray(result, model);
    }
    parseResultRaw(result, schema){
        if(_.isUndefined(schema))
            schema = this.model.schema;
        return resultParser.parseResultRaw(result, schema);
    }
    parseResultArrayRaw(result, schema){
        if(_.isUndefined(schema))
            schema = this.model.schema;
        return resultParser.parseResultArrayRaw(result, schema);
    }
    parseIntResult(result){
        return resultParser.parseIntResult(result);
    }
    parseResultAffected(result){
        return resultParser.parseResultAffected(result);
    }
    getMatch(query, params){
        let alias = 'n';
        let match = `MATCH (${alias}:${this.model.labelsStr})`;
        
        let rootQuery = this.getRootQuery(query);
        if(Object.keys(rootQuery).length > 0)
            match += ' WHERE ' + whereHelper.queryMapToWhere(this.model, rootQuery, alias, params);
        
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
        match += rel + `(${i.destAlias}:${i.r.model.labelsStr}) `;

        match += whereHelper.queryIncludeToWhere(include, params);

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
            map += `CASE WHEN ${i.destAlias} IS NOT NULL THEN ${innerMap} ELSE NULL END`
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
    getOrderBy(query){
        if(!query || !query.orderBy)
            return '';
        let terms = query.orderBy.split(',');
        let orders = [];
        for(let i in terms){
            let term = terms[i];
            let subTerms = term.trim().split(/\s+/);
            if(subTerms.length != 2 || (subTerms[1].toLowerCase() != 'asc' && subTerms[1].toLowerCase() != 'desc'))
                throw new errors.GenericError("Query order by term format error: " + term);
            let keyPath = subTerms[0];
            let direction = subTerms[1];
            let pathParts = keyPath.split('.');
            let key = pathParts[pathParts.length - 1];
            if(pathParts.length == 1){
                orders.push(`n.${key} ${direction}`);
            } else{
                let i = this.getIncludeByKeyPath(keyPath, query);
                orders.push(`${i.dataAlias}.${key} ${direction}`);
            }
        }
        return 'ORDER BY ' + orders.join(', ');
    }
    getSkipLimit(query, params){
        if(!query || !query.paged)
            return '';
        params.skip = query.paged.skip;
        params.limit = query.paged.limit;
        return `SKIP {skip} LIMIT {limit}`;
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
    getIncludeByKeyPath(path, query){
        let pathArray = path.split('.');
        if(pathArray.length == 1)
            return null;
        let includes = query.includes;
        let i;
        for(let p = 0; p < pathArray.length - 1; p++){
            let key = pathArray[p];
            i = _.find(includes, {key: key});
            if(!i)
                throw new errors.GenericError(`Error in query. Key path ${path} does not exist`);
            includes = i.includes;
        }
        return i;
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