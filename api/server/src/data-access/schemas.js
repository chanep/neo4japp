'use strict'
const Joi = require('joi');

let SkillGroup = {
    id: Joi.number(),
	name: Joi.string().required(),
    type: Joi.string().required(),
    _errorMessage: "SkillGroup is not valid "
};

module.exports = {
    SkillGroup: SkillGroup
}