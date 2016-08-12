'use strict'
const Joi = require('joi');
const _ = require('lodash');
const Model = require('./model').Model;
const Relationship = require('./model').Relationship;

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

module.exports = taskStatus;