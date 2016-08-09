'use strict'
const BaseDa = require('./base-da');
const model = require('./models').skillGroup; 

class SkillGroupDa extends BaseDa{
    constructor(tx){
        super(model, tx);
    }
}

module.exports = SkillGroupDa;