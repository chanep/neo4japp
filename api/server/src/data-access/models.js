'use strict'
const Joi = require('joi');
const errors = require('../shared/errors')

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

let skillGroup = new Model(
    'SkillGroup'
    ['SkillGroup'],
    {
        id: Joi.number(),
        name: Joi.string().required(),
        type: Joi.string().required()
    }
)

let skill = new Model(
    'Skill',
    ['Skill'],
    {
        id: Joi.number(),
        name: Joi.string().required()
    }
)

let taskStatus = new Model(
    'TaskStatus',
    ['TaskStatus'],
    {
        id: Joi.number(),
        name: Joi.string().required(),
        status: Joi.string().required(),
        lastStart: Joi.date(),
        lastFinish: Joi.date(),
        info: Joi.object()
    }
)

let employee = new Model(
    'Employee',
    ['Employee'],
    {
        id: Joi.number(),
        username: Joi.string().required(),
        email: Joi.string().required(),
        fullname: Joi.string().required(),
        first: Joi.string(),
        last: Joi.string(),
        phone: Joi.string(),
        roles: Joi.string(),
        image: Joi.string()
    }
)

skill.relateWithOne(skillGroup, "BELONGS_TO", "group", true, {})
skillGroup.relateWithOne(skill, "BELONGS_TO", "skills", false, {})
skillGroup.relateWithOne(skillGroup, "BELONGS_TO", "group", true, {})
skillGroup.relateWithOne(skillGroup, "BELONGS_TO", "group", false, {})

module.exports = {
    skill: skill,
    skillGroup: skillGroup,
    taskStatus: taskStatus,
    employee: employee
}