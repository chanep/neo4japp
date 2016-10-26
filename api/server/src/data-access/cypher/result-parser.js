'use strict'
const _ = require('lodash');
const errors = require('../../shared/errors');
const neo4j = require('neo4j-driver').v1;

module.exports = {
    parseResult: parseResult,
    parseResultArray: parseResultArray,
    parseResultRaw: parseResultRaw,
    parseResultArrayRaw: parseResultArrayRaw,
    parseIntResult: parseIntResult,
    parseResultAffected: parseResultAffected
}


function parseResultRaw(result, schema){
    var nodes = parseResultArrayRaw(result, schema);
    if(nodes.length == 0){
        return null;
    } else if(nodes.length == 1){
        return nodes[0];
    } else{
        return nodes;
    }
}
function parseResultArrayRaw(result, schema){
    var records = [];
    for(let r of result.records){
        var fields = [];
        for(let f of r._fields){
            let n = parseFieldRaw(f, schema);
            fields.push(n);
        }
        if(fields.length == 1){
            records.push(fields[0]);
        }else {
            records.push(fields);
        }
    }
    return records;
}

function parseIntResult(result){
    return getInt(result.records[0]._fields[0]);
}

function parseResultAffected(result){
    return getInt(result.records[0]._fields[0]);
}

function parseResult(result, model){
    var nodes = parseResultArray(result, model);
    if(nodes.length == 0){
        return null;
    } else if(nodes.length == 1){
        return nodes[0];
    } else{
        return nodes;
    }
}

function parseResultArray(result, model){
    var nodes = [];
    result.records.forEach(r => {
        let f = r._fields[0];
        let n = parseModelField(f, model);
        nodes.push(n);
    })
    return nodes;
}

function parseModelField(f, model){
    if(!f)
        return null;
    if(isNodeField(f))
        return parseNodeField(f, model.schema);
    let parsed = parseField(f, model.schema);
    for(let k in f){
        if(parsed[k])
            continue;
        if(isRelationship(model, k)){
            let r = model.getRelationByKey(k);
            if(r.type == 'one'){
                parsed[k] = parseRelationshipField(f[k], r);
            } else{
                parsed[k] = f[k].map(fi => parseRelationshipField(fi, r));
            }
        }
    }
    return parsed;
}
function parseRelationshipField(f, r){
    let parsed = {};
    if(r.schema){
        parsed = parseField(f, r.schema);
        let modelKey = r.model.name.toLowerCase();
        parsed[modelKey] = parseModelField(f[modelKey], r.model);
    } else{
        parsed = parseModelField(f, r.model);
    }
    return parsed;
}

function isRelationship(model, key){
    return !!(_.find(model.relationships, {key: key}));
}

function parseField(f, schema){
    let parsed = {};
    for(let k in schema){
        if(!f[k])
            continue;
        if(k == 'id'){
            parsed.id = getInt(f[k]);
        } else{
            let type = schema[k]._type;
            parsed[k] = convertFromNativeValue(f[k], type);
        }  
    }
    return parsed;
}

function parseNodeField(f, schema){
    let parsed = {};
    parsed.id = getInt(f.identity);
    for(let k in f.properties){
        let type = null;
        if(schema && schema[k])
            type = schema[k]._type;
        parsed[k] = convertFromNativeValue(f.properties[k], type);
    }
    return parsed;
}

function parseFieldRaw(f, schema){ 
    if(_.isArray(f)){
        return f.map(i => parseFieldRaw(i));
    } else if(!_.isObject(f)){
        return f;
    } else if(isNodeField(f)){
        return parseNodeField(f, schema);
    } else if(neo4j.isInt(f)){
        return getInt(f);
    } else{
        let parsed = {};
        for(let k in f){
            if(k == '_'){
                _.merge(parsed, parseFieldRaw(f[k]));
            } else {
                parsed[k] = parseFieldRaw(f[k]);
            }
        }
        return parsed;
    }
}

function convertFromNativeValue(value, type){
    if(!value)
        return value;
    if(neo4j.isInt(value))
        return getInt(value);
    if(!type)
        return value;
    switch(type){
        case "date":
            return new Date(value);
        case "object":
            return JSON.parse(value);
        default:
            return value;                 
    } 
}
function isNodeField(f){
    if(!f)
        return f;
    return (f.identity && f.properties);
}
function getInt(identity){
    return identity.low;
}

function convertToNative(data, schema){
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
