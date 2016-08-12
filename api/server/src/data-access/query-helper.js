'use strict'
const _ = require('lodash');
const errors = require('../shared/errors');

module.exports = {
    getWhere: getWhere
};

function getWhere(model, query){
    if(!query)
            return "";
    let alias = 'n';

    let parts = [];

    let rootQuery = _.omit(query, ["includes"]);
    parts.push(queryMapToCypher(model, rootQuery, alias));

    let includes = query.includes || [];

    includes.forEach(i => {
        queryIncludeToCypher(parts, i);
    });

    _.remove(parts, p => (p == ''));
    let cypher = "";
    if(parts.length > 0)
        cypher = " WHERE " + parts.join(' AND\n');
    return cypher;
}

function queryIncludeToCypher(parts, include){
    if(include.query && !_.isEmpty(include.query)){
        let part = queryMapToCypher(include.r.model, include.query, include.destAlias);
        parts.push(part);
    }
    if(include.relQuery && !_.isEmpty(include.relQuery)){
        let part = queryMapToCypher(include.r.model, include.relQuery, include.relAlias);
        parts.push(part);
    }
    include.includes.forEach(i => {
        queryIncludeToCypher(parts, i);
    });   
}

function queryMapToCypher(model, map, alias){
    let terms = [];
    for(let k in map){
        let term = queryKeyValueToCypher(model, k, map[k], alias);
        terms.push(term);
    }
    return terms.join(' AND ');
}

function queryKeyValueToCypher(model, key, value, alias){
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
    } else if(operator == '$like'){
        return likeOperatorToCypher(key, value, alias);
    } else if(operator == '$ilike'){
        return ilikeOperatorToCypher(key, value, alias);
    } else if(operator == '$lt' || operator == '$lte' || operator == '$gt' || operator == '$gte'){
        return comparisonOperatorToCypher(operator, key, value, alias);
    } else if(operator == '$relExists'){
        return relExistsOperatorToCypher(model, key, value, alias);
    }
}

function neOperatorToCypher(key, value, alias){
    value = value.$ne;
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

function comparisonOperatorToCypher(operator, key, value, alias){
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

    value = valueToCypher(value);
    return keyToCypher(key, alias) + ` ${op} ${value}`;
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

function likeOperatorToCypher(key, value, alias) {
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
    value = valueToCypher(value);
    return keyToCypher(key, alias) + ` ${op} ${value}`;
}

function ilikeOperatorToCypher(key, value, alias) {
    value = value.$ilike;
    if(!_.isString(value))
        throw new errors.GenericError("$ilike operator expects a string");
    if(value.length == 0)
        return "";

    value = value.replace(/%/g, '.*');
    
    return keyToCypher(key, alias) + ` =~ '(?i)${value}'`;
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
    if (typeof value === 'string') {
        return `'${value}'`;
    } else if (_.isDate(value)){
        return `${value.getTime()}`;
    } else if (_.isObject(value)){
        return `'${JSON.stringify(value)}'`;
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

function labelsToCypher(labels){
    let aux = [""].concat(labels);
    return aux.join(':');
}
