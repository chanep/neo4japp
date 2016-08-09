'use strict'
const BaseDa = require('./base-da');
const model = require('./models').skill; 

class SkillDa extends BaseDa{
    constructor(tx){
        super(model, tx);
    }
    createAndRelate(data, groupId){
        return super.createAndRelate(data, groupId, "group");
    }
}

module.exports = SkillDa;