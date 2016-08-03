'use strict'
const BaseDa = require('./base-da');
const schema = require('./schemas').SkillGroup; 

class SkillGroupDa extends BaseDa{
    constructor(){
        super('SkillGroup');
    }
}

module.exports = SkillGroupDa;