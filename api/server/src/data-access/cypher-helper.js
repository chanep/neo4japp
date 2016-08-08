'use strict'
const _ = require('lodash');

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