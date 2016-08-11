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

let skillGroup = new Model(
    'SkillGroup',
    ['SkillGroup'],
    {
        id: Joi.number(),
        name: Joi.string().required(),
        type: Joi.string().required()
    }
);

let skill = new Model(
    'Skill',
    ['Skill'],
    {
        id: Joi.number(),
        name: Joi.string().required()
    }
);

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
);

let office = new Model(
    'Office',
    ['Office'],
    {
        id: Joi.number(),
        sourceId: Joi.string().required(),
        name: Joi.string().required(),
        description: Joi.string(),
        acronym: Joi.string().required(),
        counrty: Joi.string().required(),
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
        address: Joi.string(),
        phone: Joi.string(),
        zip: Joi.string(),
        uri: Joi.string()
    }
);

let department = new Model(
    'Department',
    ['Department'],
    {
        id: Joi.number(),
        sourceId: Joi.string(),
        name: Joi.string().required()
    }
);

let position = new Model(
    'Position',
    ['Position'],
    {
        id: Joi.number(),
        sourceId: Joi.string(),
        name: Joi.string().required()
    }
);

let employee = new Model(
    'Employee',
    ['Employee'],
    {
        id: Joi.number(),
        sourceId: Joi.string(),
        username: Joi.string().required(),
        email: Joi.string().required(),
        fullname: Joi.string().required(),
        first: Joi.string(),
        last: Joi.string(),
        phone: Joi.string(),
        roles: Joi.string(),
        image: Joi.string()
    }
);

let knowledgeSchema = {
        id: Joi.number(),
        level: Joi.number(),
        want: Joi.boolean().default(false),
        approved: Joi.boolean().default(false),
        approverId: Joi.number(),
        approverFullname: Joi.string()
    };


skill.relateWithOne(skillGroup, "BELONGS_TO", "group", true, null)
skillGroup.relateWithMany(skill, "BELONGS_TO", "skills", false, null)
skillGroup.relateWithOne(skillGroup, "BELONGS_TO", "skillparent", true, {})

employee.relateWithMany(skill, "KNOWS", "knowledges", true, knowledgeSchema);
employee.relateWithOne(office, "OF_OFFICE", "office", true, null);
employee.relateWithOne(department, "OF_DEPARTMENT", "department", true, null);
employee.relateWithOne(position, "OF_POSITION", "position", true, null);

module.exports = {
    skill: skill,
    skillGroup: skillGroup,
    taskStatus: taskStatus,
    employee: employee,
    office: office,
    department: department,
    position: position
}