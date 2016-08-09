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
        let param = {id: id};
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
        let cmd = `CREATE (n${this._labelCypher} {data}) 
                   RETURN n`
        let params = {data: this.convertToNative(data)};
        return [cmd, params];
    }
    updateCmd(data, mergeKeys){
        let operator = mergeKeys? '+=' : '=';
        let cmd = `MATCH (n${this._labelCypher}) WHERE ID(n) = {id} 
                      SET n ${operator} {data}
                        RETURN n`;
        let dataAux = _.omit(data, ["id"]);
        let params = {data: this.convertToNative(dataAux)};
        return [cmd, params];
    }
    deleteCmd(id, force){
        let cmd = `
            MATCH (n${this._labelCypher}) WHERE ID(n) = {id} 
            DELETE n
            RETURN count(n) as affected`;
        if(force){
            cmd = `
                MATCH (n${this._labelCypher}) WHERE ID(n) = {id} 
                OPTIONAL MATCH (n${this._labelCypher})-[r]-() WHERE ID(n) = {id} 
                DELETE n,r
                RETURN count(n) as affected`;
        }
        let params = {id: id};
        return [cmd, params];
    }
    relateCmd(id, otherId, relKey, relData, replace){
        let r = this.model.getRelationByKey(key);

        let dir1 = '>';
        let dir2 = '';
        if(!r.outgoing){
            dir1 = '<';
            dir2 = '';
        }

        relData = relData || {};
        let relDataStr = this.mapToStr(relData, "relData");
        let cmd = `
            MATCH (n${this._labelsCypher}),(m)
            WHERE ID(n) = {id} AND ID(m) = {otherId}
            MERGE (n)${dir1}-[r:${r.label} ${relDataStr}]-${dir2}(m)
            RETURN r`;

        if(replace){
            cmd = `
                MATCH (n${this._labelsCypher}),(m)
                WHERE ID(n) = {id} AND ID(m) = {otherId}
                CREATE UNIQUE (n)${dir1}-[r:${r.label}]-${dir2}(m)
                SET r = {relData}
                RETURN r`;
        }
        
        let params = {id: neo4j.int(id), otherId: neo4j.int(otherId), relData: relData};

        return [cmd, params];
    }
    createAndRelateCmd(
        
    )
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
                    n[r.key] = this.parseField(f[key], r.schema);
                } else{
                    n[r.key] = f[key].map(f2 =>{
                        return this.parseField(f2, r.schema);
                    }) 
                }
            })

            nodes.push(e);
        })
        return entities;
    }
    parseField(f, schema){
        let parsed = {
            id: f.identity.low
        }
        for(let k in f.properties){
            parsed[k] = f.properties[k];
        }
        return this.convertFromNative(parsed, schema);
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
        let ret = `RETURN {identity: ID(n)`;
        includes = includes || [];

        for(let key in this.model.schema){
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
    mapToStr(map, mapName){
        let terms = [];
        for(let k in map){
            terms.push(`${k}: {${mapName}}.${k}`);
        }
        return '{' + terms.join(', ') + '}';
    }
    convertToNative(data, shcema){
        if(!schema)
            return data;
        let nativeData = _.clone(data);
        for(let k in schema){
            let type = schema[k]._type;
            switch (type) {
                case "date":
                    nativeData[k] = data[k].getTime();
                    break;
                case "object":
                    nativeData[k] = JSON.stringify(data[k]);
                    break;
            }
        }
        return nativeData;
    }
    convertFromNative(nativeData, shcema){
        if(!schema)
            return nativeData;
        let data = _.clone(nativeData);
        for(let k in schema){
            let type = schema[k]._type;
            switch(type){
                case "date":
                    data[k] = new Date(nativeData[k]);
                    break;
                case "object":
                    data[k] = JSON.parse(nativeData[k]);
                    break;                   
            }
        }
        return data;
    }
}