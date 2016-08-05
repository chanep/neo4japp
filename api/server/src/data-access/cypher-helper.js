'use strict'
const _ = require('lodash');


module.exports = {
    getWhere: function(query, alias){
        alias = alias || 'n'; 
        let conditions = [];
        for(let k in query){
            let value = query[k];
            if(typeof value === 'string' && value.indexOf('*') >= 0){
                value = value.replace(/\*/g, '.*');
                conditions.push(`${alias}.${k} =~ '(?i)${value}'`);
            } else{
                conditions.push(`${alias}.${k} = ${value}`);
            }
        }

        let cypher = " WHERE " + conditions.join(' AND ');
        return cypher;
    },

    toEntity: function(result){
        var entities = [];
        result.records.forEach(r => {
            let f = r._fields[0];
            let e = {id: f.identity.low};
            _.merge(e, f.properties);
            entities.push(e);
        })
        if(entities.length == 0){
            return null;
        } else if(entities.length == 1){
            return entities[0];
        } else{
            return entities;
        }
    },

    mapToStr: function(map, mapName){
        let terms = [];
        for(let k in map){
            terms.push(`${k}: {${mapName}}.${k}`);
        }
        return '{' + terms.join(', ') + '}';
    }
}