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
        acronym: Joi.string().allow(null),
        country: Joi.string().allow(null),
        latitude: Joi.number().allow(null),
        longitude: Joi.number().allow(null),
        address: Joi.string().allow(null),
        phone: Joi.string().allow(null),
        zip: Joi.string().allow(null),
        uri: Joi.string().allow(null),
        timezone: Joi.number().allow(null)
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

let client = new Model(
    'Client',
    ['Client'],
    {
        id: Joi.number(),
        phonelistId: Joi.number().allow(null),
        name: Joi.string().required()
    }
);

let user = new Model(
    'User',
    ['User'],
    {
        id: Joi.number(),
        sourceId: Joi.string(),
        phonelistId: Joi.number(),
        username: Joi.string().required(),
        type: Joi.string().required(),
        email: Joi.string().required(),
        fullname: Joi.string().required(),
        first: Joi.string().allow(null),
        last: Joi.string().allow(null),
        level: Joi.string().allow(null),
        roles: Joi.array().default([]).items(Joi.string()),
        phone: Joi.string().allow(null),
        image: Joi.string().allow(null),
        disabled: Joi.boolean().default(false),
        lastUpdate: Joi.date(),
        lastSkillUpdate: Joi.date(),
        lastLogin: Joi.date(),
    }
);

let knowledgeSchema = {
        id: Joi.number(),
        level: Joi.number().allow(null),
        want: Joi.boolean().default(false),
        approved: Joi.boolean().default(false).allow(null),
        approverId: Joi.number().allow(null),
        approverFullname: Joi.string().allow(null)
    };

let workedForSchema = {
    id: Joi.number(),
    previously: Joi.boolean().default(false) //worked for that client before RGA
}

let searchSchema = {
        id: Joi.number(),
        date: Joi.date().required()
    };


let allocation = new Model(
    'Allocation',
    ['Allocation'],
    {
        id: Joi.number(),
        startDate: Joi.array().items(Joi.string()).required(),
        weekHours: Joi.array().items(Joi.number()).required(),
        workingWeekHours: Joi.array().items(Joi.number()).required(),
        totalHours: Joi.number().required()
    }
);

let interest = new Model(
    'Interest',
    ['Interest'],
    {
        id: Joi.number(),
        name: Joi.string().required()
    }
);

let outgoing = true;
let incoming = false;

let multiple = true;
let single = false;

user.relateWithMany(skill, "KNOWS", "knowledges", outgoing, knowledgeSchema);
user.relateWithOne(office, "OF_OFFICE", "office", outgoing, null);
user.relateWithOne(department, "OF_DEPARTMENT", "department", outgoing, null);
user.relateWithOne(position, "OF_POSITION", "position", outgoing, null);
user.relateWithMany(skill, "SEARCHED", "searches", outgoing, searchSchema, multiple);

user.relateWithMany(user, "APPROVED_BY", "approvers", outgoing, null);
user.relateWithMany(user, "R_MANAGED_BY", "resourceManagers", outgoing, null);

user.relateWithMany(client, "WORKED_FOR", "clients", outgoing, workedForSchema);
user.relateWithOne(allocation, "ALLOCATION", "allocation", outgoing, null);
allocation.relateWithOne(user, "ALLOCATION", "user", incoming, null);

user.relateWithMany(interest, "INTERESTED_IN", "interests", outgoing, null);

module.exports = {
    user: user,
    office: office,
    department: department,
    position: position,
    allocation: allocation,
    client: client,
    interest: interest
}
