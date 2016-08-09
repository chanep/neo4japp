'use strict'
const _ = require('lodash');
const errors = require('../shared/errors');


class CypherHelper {
    constructor(model){
        this.model = model;
        let aux = [""].concat(this.model.labels);
        this._labelsCypher = aux.join(':');
    }
    findCmd(query){
        let where = this.getWhere(query);
        let match = this.getMatch(query);
        let ret = this.getReturn(query);
        let cmd = `${match}
                    ${where}
                    ${ret}`;
    }
    relateCmd(id, otherId, relKey, relData, replace){
        
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
    parseResultArray(result, query){
        var nodes = [];
        result.records.forEach(r => {
            let f = r._fields[0];
            let n = this.parseField(f);

            let include = [];
            if(query && query.include)
                include = query.include;   
            include.forEach(key => {
                let r = this.model.getRelationByKey(key);
                if(!r) throw new errors.GenericError(`Model ${this.model.name} does not have a relationship with key ${key}`);
                if(r.type == 'one'){
                    n[r.key] = this.parseField(f[key]);
                } else{
                    n[r.key] = f[key].map(f2 =>{
                        return this.parseField(f2);
                    }) 
                }
            })

            nodes.push(e);
        })
        return entities;
    }
    parseField(f){
        let parsed = {
            id: f.identity.low
        }
        for(let k in f.properties){
            parsed[k] = f.properties[k];
        }
        return parsed;
    }
    getMatch(query){
        let match = `MATCH (n${this._labelsCypher})`;
        let include = query.include || [];

        let i = 1;
        include.forEach(key => {
            i++;
            let r = this.model.getRelationByKey(key);
            if(!r) throw new errors.GenericError(`Model ${this.model.name} does not have a relationship with key ${key}`);
            let rel = `-[r${i}:${r.label}]->`;
            if(!r.outgoing){
                rel = `<-[r${i}:${r.label}]-`;
            }
            match += `\nOPTIONAL MATCH (n)${rel}(n${i})`
        })

        return match;
    }
    getReturn(query){
        let ret = `RETURN {identity: ID(n)`;
        let include = query.include || [];

        for(let key in this.model.schema){
            ret += `, ${key}: n.${key}`;
        }

        let i = 1;
        include.forEach(key => {
            i++;
            let r = this.model.getRelationByKey(key);
            if(!r) throw new errors.GenericError(`Model ${this.model.name} does not have a relationship with key ${key}`);
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
}

let parseResultArray = function(result){
        console.log("result",JSON.stringify(result))
        var entities = [];
        result.records.forEach(r => {
            let f = r._fields[0];
            let e = {id: f.identity.low};
            _.merge(e, f.properties);
            entities.push(e);
        })
        return entities;
    };

module.exports = {
    getWhere: function(query, alias){
        if(!query)
            return "";
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
    },

    parseResult: function(result){
        var entities = this.parseResultArray(result);
        if(entities.length == 0){
            return null;
        } else if(entities.length == 1){
            return entities[0];
        } else{
            return entities;
        }
    },

    parseResultArray: function(result){
        var entities = [];
        result.records.forEach(r => {
            let f = r._fields[0];
            let e = {id: f.identity.low};
            _.merge(e, f.properties);
            entities.push(e);
        })
        return entities;
    },

    mapToStr: function(map, mapName){
        let terms = [];
        for(let k in map){
            terms.push(`${k}: {${mapName}}.${k}`);
        }
        return '{' + terms.join(', ') + '}';
    }
}