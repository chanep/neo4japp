'use strict'
const BaseDa = require('./base-da');

class SkillGroupDa extends BaseDa{
    constructor(tx){
        super(tx, 'SkillGroup');
    }
}

module.exports = SkillGroupDa;