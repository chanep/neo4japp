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
        if(query && query.includes)
            includes = query.includes;
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
    parseResult(result, includes){
        var nodes = this.parseResultArray(result, includes);
        if(nodes.length == 0){
            return null;
        } else if(nodes.length == 1){
            return nodes[0];
        } else{
            return nodes;
        }
    }
    parseResultArray(result, includes){
        var nodes = [];
        result.records.forEach(r => {
            let f = r._fields[0];
            let n = this.parseField(f, this.model.schema);

            includes = includes || []; 
            includes.forEach(key => {
                let r = this.model.getRelationByKey(key);
                if(r.type == 'one'){
                    n[r.key] = this.parseField(f[key], r.model.schema);
                } else{
                    n[r.key] = f[key].map(f2 =>{
                        return this.parseField(f2, r.model.schema);
                    }) 
                }
            })

            nodes.push(n);
        })
        return nodes;
    }
    parseResultAffected(result){
        return result.records[0]._fields[0].low;
    }
    parseField(f, schema){
        if(!f)
            return null;
        let parsed = {};
        if(this.isNodeField(f)){
            parsed.id = this.getId(f.identity);
            for(let k in f.properties){
                parsed[k] = f.properties[k];
            }
        } else {
            for(let k in schema){
                if(k == 'id'){
                    parsed[k] = this.getId(f[k]);
                } else{
                    parsed[k] = f[k];
                }   
            }
        }

        return this.convertFromNative(parsed, schema);
    }
    isNodeField(f){
        return (f.identity && f.properties);
    }
    getId(identity){
        return identity.low;
    }
    getMatch(includes){
        let match = `MATCH (n${this._labelsCypher})`;
        includes = includes || [];

        let i = 1;
        includes.forEach(key => {
            i++;
            let r = this.model.getRelationByKey(key);
            let rel = `-[r${i}:${r.label}]->`;
            if(!r.outgoing){
                rel = `<-[r${i}:${r.label}]-`;
            }
            match += `\nOPTIONAL MATCH (n)${rel}(n${i})`
        })

        return match;
    }
    getReturn(includes){
        let ret = `RETURN {id: ID(n)`;
        includes = includes || [];

        for(let key in this.model.schema){
            if(key != 'id')
                ret += `, ${key}: n.${key}`;
        }

        let i = 1;
        includes.forEach(key => {
            i++;
            let r = this.model.getRelationByKey(key);
            let rel = `, ${r.key}: n${i}`;
            if(r.type == 'many'){
                rel = ` ,${r.key}: COLLECT(n${i})`;
            }
            ret += rel;
        })
        ret += '}';
        return ret;
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
    mapToStr(map, mapName){
        let terms = [];
        for(let k in map){
            terms.push(`${k}: {${mapName}}.${k}`);
        }
        return '{' + terms.join(', ') + '}';
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
    convertFromNative(nativeData, schema){
        if(!schema)
            return nativeData;
        let data = _.clone(nativeData);
        for(let k in schema){
            let type = schema[k]._type;
            switch(type){
                case "date":
                    if(nativeData[k])
                        data[k] = new Date(nativeData[k]);
                    break;
                case "object":
                    if(nativeData[k])
                        data[k] = JSON.parse(nativeData[k]);
                    break;                   
            }
        }
        return data;
    }
}

module.exports = CypherHelper;