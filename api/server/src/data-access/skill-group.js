'use strict'
const BaseDa = require('./base-da');
const model = require('./models').skillGroup; 

class SkillGroupDa extends BaseDa{
    constructor(tx){
        super(model, tx);
    }

    checkExistsByName(level1, level2) {
    	var queryStmt = "match (level2:SkillGroup)-[parent]->(level1:SkillGroup) where level2.name = '" + level2  + "' and level1.name = '" + level1 + "' return level2";
    	return super.query(queryStmt);
    }
}

module.exports = SkillGroupDa;