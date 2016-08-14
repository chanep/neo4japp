'use strict'
const Joi = require('joi');
const _ = require('lodash');
const Model = require('./model').Model;

let appSetting = new Model(
    'AppSetting',
    ['AppSetting'],
    {
        id: Joi.number(),
        name: Joi.string().required(),
        value: Joi.string().required()
    }
);

module.exports = appSetting;