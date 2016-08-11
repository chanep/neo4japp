'use strict'
const _ = require('lodash');

module.exports = {
    getWherePart: getWherePart
};

function getWherePart(query, alias){
    if(!query || _.isEmpty(query))
        return "";
    
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

function queryMapToStr(map, alias){
    let terms = [];
    for(let k in map){
        let term = queryKeyToStr(k, map[k], alias);
        terms.push(term);
    }
    return terms.join(' AND ');
}

function queryKeyToStr(key, value, alias){
    let terms = [];
    for(let k in map){
        let term = queryKeyToStr(k, map[k], alias);
        terms.push(term);
    }
    return terms.join(' AND ');
}

