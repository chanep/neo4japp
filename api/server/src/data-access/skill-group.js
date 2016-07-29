'use strict'
const BaseDa = require('./base-da');
const schema = require('./schemas').SkillGroup; 

class SkillGroupDa extends BaseDa{
    constructor(){
        super('SkillGroup');
    }
    save(data){
        return this._validate(data, schema)
            .then(data => {
                return super.save(data);
            });
    }
}

module.exports = SkillGroupDa;