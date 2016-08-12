'use strict'
const Joi = require('joi');
const _ = require('lodash');
const errors = require('../shared/errors');
const config = require('../shared/config');
const partition = config.db.partition;

class Relationship {
    constructor(model, label, key, type, outgoing, schema){
        this.model = model;
        this.label = label;
        this.key = key;
        this.type = type;
        this.outgoing = outgoing;
        this.schema = schema;
    }
}

class Model {
    constructor(name, labels, schema){
        this.name = name;
        this.labels = labels;
        this.schema = schema;
        this.relationships = [];
        if(partition){
            this.labels.push(partition);
        }
    }
    relateWithOne(model, label, key, outgoing, schema){
        let r = new Relationship(model, label, key, "one", outgoing, schema)
        this.relationships.push(r);
    }
    relateWithMany(model, label, key, outgoing, schema){
        let r = new Relationship(model, label, key, "many", outgoing, schema)
        this.relationships.push(r);
    }
    getRelationByKey(key){
        let r = _.find(this.relationships, {key: key});
        if(!r) 
            throw new errors.GenericError(`Model ${this.name} does not have a relationship with key ${key}`);
        return r;
    }
    getAllRelationKeys(){
        return this.relationships.map(r => r.key);
    }
}

module.exports = {
    Model: Model,
    Relationship: Relationship
};