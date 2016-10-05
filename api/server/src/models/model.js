'use strict'
const Joi = require('joi');
const _ = require('lodash');
const errors = require('../shared/errors');
const config = require('../shared/config');
const partitionSuffix = config.db.partitionSuffix;

class Relationship {
    /**
     * Creates an instance of Relationship.
     * 
     * @param {Model} model - The model to relate with
     * @param {string} label - Label (type) of the relationship
     * @param {string} key - Identify the relationship
     * @param {string} type - "one" or "many"
     * @param {boolean} outgoing
     * @param {object} schema - For relationships that hold data
     * @param {boolean} multiple - Allows mor than one relation between the same 2 nodes. 
     * If false new relation between 2 nodes overwrites the old relationship
     * 
     */
    constructor(model, label, key, type, outgoing, schema, multiple){
        this.model = model;
        this.label = label;
        this.key = key;
        this.type = type;
        this.outgoing = outgoing;
        this.multiple = multiple || false;
        this.schema = schema;
        if(this.multiple && this.isToOne())
            throw new errors.GenericError(`Error creating ${key} relationship. One to One relationship cannot be multiple`)
    }
    isToOne(){
        return (this.type == "one");
    }
    isToMany(){
        return (this.type == "many");
    }
}

class Model {
    constructor(name, labels, schema){
        this.name = name;
        this.labels = labels;
        this.schema = schema;
        this.relationships = [];
        if(partitionSuffix){
            for(let i in this.labels){
                this.labels[i] += partitionSuffix;
            }
        }
        this.labelsStr = this.labels.join(':');
    }
    relateWithOne(model, label, key, outgoing, schema, multiple){
        let r = new Relationship(model, label, key, "one", outgoing, schema, multiple)
        this.relationships.push(r);
    }
    relateWithMany(model, label, key, outgoing, schema, multiple){
        let r = new Relationship(model, label, key, "many", outgoing, schema, multiple)
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