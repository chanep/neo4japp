'use strict'
const _ = require('lodash');
const errors = require('../shared/errors');

module.exports = {
    getWherePart: getWherePart,
    queryMapToCypher: queryMapToCypher
};

function getWherePart(query, alias){
    if(!query || _.isEmpty(query))
        return "";
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

    let cypher = conditions.join(' AND ');
    return cypher;
}

function queryMapToCypher(map, alias){
    let terms = [];
    for(let k in map){
        let term = queryKeyValueToCypher(k, map[k], alias);
        terms.push(term);
    }
    return terms.join(' AND ');
}

function queryKeyValueToCypher(key, value, alias){
    let operator = getOperator(key, value);
    if(!operator){
        return simpleConditionToCypher(key, value, alias);
    } else if(operator == '$or'){
        return orOperatorToCypher(key, value, alias);
    } else if(operator == '$and'){
        return andOperatorToCypher(key, value, alias);
    } else if(operator == '$not'){
        return notOperatorToCypher(key, value, alias);
    } else if(operator == '$in'){
        return inOperatorToCypher(key, value, alias);
    } else if(operator == '$ne'){
        return neOperatorToCypher(key, value, alias);
    }
}

function neOperatorToCypher(key, value, alias){
    if(value == null)
        return keyToCypher(key, alias) + ' IS NOT NULL';
    value = valueToCypher(value);
    return keyToCypher(key, alias) + ` <> ${value}`;
}

function orOperatorToCypher(key, value, alias){
    if(!Array.isArray(value))
        throw new errors.GenericError("$or operator expects an array");
    let terms = [];
    value.forEach(map => {
        let term = queryMapToCypher(map, alias);
        terms.push(term);
    })
    return '(' + terms.join(' OR ') + ') ';
}

function andOperatorToCypher(key, value, alias){
    if(!Array.isArray(value))
        throw new errors.GenericError("$and operator expects an array");
    let terms = [];
    value.forEach(map => {
        let term = queryMapToCypher(map, alias);
        terms.push(term);
    })
    return '(' + terms.join(' AND ') + ') ';
}

function inOperatorToCypher(key, value, alias){
    value = value.$in;
    if(!Array.isArray(value))
        throw new errors.GenericError("$in operator expects an array");
    let terms = [];
    value.forEach(i => {
        let term = valueToCypher(i);
        terms.push(term);
    })
    return keyToCypher(key, alias) + ` IN [${terms.join(', ')}]`;
}

function notOperatorToCypher(key, value, alias){
    if(!_.isObject(value))
        throw new errors.GenericError("$not operator expects a object");
    return 'NOT(' + queryMapToCypher(map, alias) + ')';
}

function getOperator(key, value){
    if(typeof k === 'string' && k[0] == '$')
        return key;
    
    if(_.isObject(value) && Object.keys(value).length == 1 && Object.keys(value)[0][0] == '$' )
        return Object.keys(value)[0];
    
    return null;
}

function simpleConditionToCypher(key, value, alias) {
    if(value == null)
        return keyToCypher(key, alias) + ' IS NULL';
    let equal = '='
    if (valueIsRegEx(value))
        equal = '=~';
    value = valueToCypher(value);
    return keyToCypher(key, alias) + ` ${equal} ${value}`;
}

function valueToCypher(value){
    if (typeof value === 'string' && value.indexOf('*') >= 0) {
        value = value.replace(/\*/g, '.*');
        return `'(?i)${value}'`;
    } else if (typeof value === 'string') {
        return `'${value}'`;
    } else if (_.isDate(value)){
        return `${value.getTime()}`;
    } else{
        return value;
    }
}

function keyToCypher(key, alias){
    if(key == 'id')
        return `ID(${alias}.id)`;
    return `${alias}.${key}`;
}

function valueIsRegEx(){
    if (typeof value === 'string' && value.indexOf('*') >= 0)
        return true;
    return false;
}

