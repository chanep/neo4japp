'use strict'
const BaseDa = require('./base-da');
const schema = require('./schemas').Skill; 

class SkillDa extends BaseDa{
    constructor(tx){
        super(tx, 'Skill', schema);
    }
}

module.exports = SkillGroupDa;