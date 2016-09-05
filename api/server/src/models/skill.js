'use strict'
const Joi = require('joi');
const _ = require('lodash');
const Model = require('./model').Model;
const Relationship = require('./model').Relationship;

let skillGroup = new Model(
    'SkillGroup',
    ['SkillGroup'],
    {
        id: Joi.number(),
        name: Joi.string().required(),
        type: Joi.string().required().allow(['tool', 'skill', 'project', 'industry'])
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

skill.relateWithOne(skillGroup, "BELONGS_TO", "group", true, null)
skillGroup.relateWithMany(skill, "BELONGS_TO", "skills", false, null)
skillGroup.relateWithOne(skillGroup, "BELONGS_TO", "parent", true, null)


module.exports = {
    skill: skill,
    skillGroup: skillGroup
};