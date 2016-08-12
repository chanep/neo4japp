'use strict'
const Joi = require('joi');
const _ = require('lodash');
const Model = require('./model').Model;
const Relationship = require('./model').Relationship;
const skill = require('./skill').skill;

let office = new Model(
    'Office',
    ['Office'],
    {
        id: Joi.number(),
        sourceId: Joi.string().required(),
        name: Joi.string().required(),
        description: Joi.string().allow(null),
        acronym: Joi.string().required(),
        country: Joi.string().required(),
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
        address: Joi.string().allow(null),
        phone: Joi.string().allow(null),
        zip: Joi.string().allow(null),
        uri: Joi.string().allow(null)
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
        sourceId: Joi.string().allow(null),
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
        type: Joi.string().required(),
        email: Joi.string().required(),
        fullname: Joi.string().required(),
        first: Joi.string().allow(null),
        last: Joi.string().allow(null),
        phone: Joi.string().allow(null),
        roles: Joi.string().allow(null),
        image: Joi.string().allow(null)
    }
);

let knowledgeSchema = {
        id: Joi.number(),
        level: Joi.number().allow(null),
        want: Joi.boolean().default(false),
        approved: Joi.boolean().default(false),
        approverId: Joi.number().allow(null),
        approverFullname: Joi.string().allow(null)
    };

employee.relateWithMany(skill, "KNOWS", "knowledges", true, knowledgeSchema);
employee.relateWithOne(office, "OF_OFFICE", "office", true, null);
employee.relateWithOne(department, "OF_DEPARTMENT", "department", true, null);
employee.relateWithOne(position, "OF_POSITION", "position", true, null);

module.exports = {
    employee: employee,
    office: office,
    department: department,
    position: position
}