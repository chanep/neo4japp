'use strict'
const _ = require('lodash');
const errors = require('../../shared/errors');
const neo4j = require('neo4j-driver').v1;

module.exports = {
    queryIncludeToWhere: queryIncludeToWhere,
    queryMapToWhere: queryMapToWhere
};

function queryIncludeToWhere(include, params){
    if(include.query && !_.isEmpty(include.query)){
        return 'WHERE ' + queryMapToWhere(include.r.model, include.query, include.destAlias, params);
    }
    if(include.relQuery && !_.isEmpty(include.relQuery)){
        return 'WHERE ' + queryMapToWhere(include.r.model, include.relQuery, include.relAlias, params);
    }
    return '';
}

function queryMapToWhere(model, map, alias, params){
    let terms = [];
    for(let k in map){
        let term = queryKeyValueToCypher(model, k, map[k], alias, params);
        terms.push(term);
    }
    return terms.join(' AND ');
}

function queryKeyValueToCypher(model, key, value, alias, params){
    let operator = getOperator(key, value);
    if(!operator){
        return simpleConditionToCypher(key, value, alias, params);
    } else if(operator == '$or'){
        return orOperatorToCypher(key, value, alias, params);
    } else if(operator == '$and'){
        return andOperatorToCypher(key, value, alias, params);
    } else if(operator == '$not'){
        return notOperatorToCypher(key, value, alias, params);
    } else if(operator == '$in'){
        return inOperatorToCypher(key, value, alias, params);
    } else if(operator == '$ne'){
        return neOperatorToCypher(key, value, alias, params);
    } else if(operator == '$like'){
        return likeOperatorToCypher(key, value, alias, params);
    } else if(operator == '$ilike'){
        return ilikeOperatorToCypher(key, value, alias, params);
    } else if(operator == '$lt' || operator == '$lte' || operator == '$gt' || operator == '$gte'){
        return comparisonOperatorToCypher(operator, key, value, alias, params);
    } else if(operator == '$relExists'){
        return relExistsOperatorToCypher(model, key, value, alias, params);
    }
}
function neOperatorToCypher(key, value, alias, params){
    value = value.$ne;
    if(value == null)
        return keyToCypher(key, alias) + ' IS NOT NULL';
    value = valueToCypher(value, key);
    let paramName = keyToParamName(key, alias);
    params[paramName] = value;
    return keyToCypher(key, alias) + ` <> {${paramName}}`;
}

function orOperatorToCypher(key, value, alias, params){
    if(!Array.isArray(value))
        throw new errors.GenericError("$or operator expects an array");
    let terms = [];
    value.forEach(map => {
        let term = queryMapToWhere(null, map, alias, params);
        terms.push(term);
    })
    return '(' + terms.join(' OR ') + ') ';
}

function andOperatorToCypher(key, value, alias, params){
    if(!Array.isArray(value))
        throw new errors.GenericError("$and operator expects an array");
    let terms = [];
    value.forEach(map => {
        let term = queryMapToWhere(null, map, alias, params);
        terms.push(term);
    })
    return '(' + terms.join(' AND ') + ') ';
}

function inOperatorToCypher(key, value, alias, params){
    value = value.$in;
    if(!Array.isArray(value))
        throw new errors.GenericError("$in operator expects an array");

    let paramName = keyToParamName(key, alias);
    params[paramName] = [];
    value.forEach(i => {
        let parsed = valueToCypher(i, key);
        params[paramName].push(parsed);
    })
    return keyToCypher(key, alias) + ` IN {${paramName}}`;
}

function notOperatorToCypher(key, value, alias, params){
    if(!_.isObject(value))
        throw new errors.GenericError("$not operator expects a object");
    return 'NOT(' + queryMapToWhere(null, value, alias, params) + ')';
}

function comparisonOperatorToCypher(operator, key, value, alias, params){
    let op;
    switch(operator){
        case '$lt':
            op = '<';
            break;
        case '$lte':
            op = '<=';
            break;
        case '$gt':
            op = '>';
            break;
        case '$lt':
            op = '>=';
            break;
    }
    value = value[operator];
    value = valueToCypher(value, key);
    let paramName = keyToParamName(key, alias);
    params[paramName] = value;
    return keyToCypher(key, alias) + ` ${op} {${paramName}}`;
}

function relExistsOperatorToCypher(model, key, value, alias){
    value = value.$relExists;
    if(!_.isBoolean(value))
        throw new errors.GenericError("$relExists operator expects a boolean");
    let r = model.getRelationByKey(key);
    let cypher;
    if(r.outgoing){
        cypher = `(${alias})-[:${r.label}]->(${labelsToCypher(r.model.labels)})`;
    } else{
        cypher = `(${alias})<-[:${r.label}]-(${labelsToCypher(r.model.labels)})`;
    }
    if(!value)
        cypher = 'NOT ' + cypher;
    return cypher;
}

function likeOperatorToCypher(key, value, alias, params) {
    value = value.$like;
    if(!_.isString(value))
        throw new errors.GenericError("$like operator expects a string");
    if(value.length == 0)
        return "";
    let any = '%';
    let op = 'CONTAINS';
    if(value[0] == any && value.length > 1 && value[value.length - 1] != any){
        op = 'STARTS WITH'
    } else if (value[0] != any && value.length > 1 && value[value.length - 1] == any){
        op = 'ENDS WITH'
    }

    value = value.replace(any, '');
    let paramName = keyToParamName(key, alias);
    params[paramName] = value;
    return keyToCypher(key, alias) + ` ${op} {${paramName}}`;
}

function ilikeOperatorToCypher(key, value, alias, params) {
    value = value.$ilike;
    if(!_.isString(value))
        throw new errors.GenericError("$ilike operator expects a string");
    if(value.length == 0)
        return "";

    value = '(?i)' + value.replace(/%/g, '.*');
    let paramName = keyToParamName(key, alias);
    params[paramName] = value;
    return keyToCypher(key, alias) + ` =~ {${paramName}}`;
}

function getOperator(key, value){
    if(typeof key === 'string' && key[0] == '$')
        return key;
    
    if(_.isObject(value) && Object.keys(value).length == 1 && Object.keys(value)[0][0] == '$' )
        return Object.keys(value)[0];
    
    return null;
}



function simpleConditionToCypher(key, value, alias, params) {
    if(value == null)
        return keyToCypher(key, alias) + ' IS NULL';
    let equal = '='
    if (valueIsRegEx(value))
        equal = '=~';
    value = valueToCypher(value, key);
    let paramName = keyToParamName(key, alias);
    params[paramName] = value;

    return keyToCypher(key, alias) + ` ${equal} {${paramName}}`;
}

function valueToCypher(value, key){
    if(key == 'id' && _.isInteger(value)){
        return neo4j.int(value);
    } else if (_.isDate(value)){
        return value.getTime();
    } else if (_.isObject(value)){
        return JSON.stringify(value);
    } else{
        return value;
    }
}

function keyToCypher(key, alias){
    if(key == 'id')
        return `ID(${alias})`;
    return `${alias}.${key}`;
}
function keyToParamName(key, alias){
    return `${alias}_${key}`;
}

function valueIsRegEx(){
    if (typeof value === 'string' && value.indexOf('*') >= 0)
        return true;
    return false;
}

function labelsToCypher(labels){
    let aux = [""].concat(labels);
    return aux.join(':');
}
