'use strict'
const BaseDa = require('./base-da');
const model = require('./models').skill; 

class SkillDa extends BaseDa{
    constructor(tx){
        super(model, tx);
    }
}

module.exports = SkillGroupDa;