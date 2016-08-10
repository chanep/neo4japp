'use strict'
const BaseDa = require('./base-da');
const model = require('./models').skillGroup;

class SkillGroupDa extends BaseDa{
    constructor(tx){
        super(model, tx);
    }

    checkLevel1(level1) {
    	var queryStmt = "MATCH (level1:SkillGroup) WHERE NOT ((level1)-[:BELLONGS_TO]->()) AND level1.name = {level1name} RETURN level1";
    	var params = {
    		'level1name': level1.name
    	};

    	return super._run(queryStmt, params).then(r => {
    		var resultReturn = {
    			'action': '',
    			'id': 0
    		};

    		if (r.records.length == 0) {
    			var newLevel1 = new SkillGroupDa();
				let obj = {
					'name': level1.name,
	        		'type': level1.type
	        	};

				return newLevel1.create(obj).then(result => {
					resultReturn.id = result.id;
					resultReturn.action = 'inserted';

					return resultReturn;
				}).catch(err => {
					let e = new errors.GenericError("Error importing skill group level 1:" + obj, err);
					console.log(e);

					resultReturn.action = 'error';
					return resultReturn;
				});
    		}
    		else {
    			resultReturn.action = '';    			
    			resultReturn.id = r.records[0].get('level1')['identity'];
    			return resultReturn;
    		}
    	});
    }

    checkLevel2(level1ID, level2Name) {
    	var queryStmt = "MATCH (level1:SkillGroup) WHERE NOT ((level1)-[:BELLONGS_TO]->()) AND level1.name = {level1name} RETURN level1";
    	var params = {
    		'level1ID': level1
    	};
    	return super._run(queryStmt, params).then(r => {
    		if (r.records.length == 0)
    			return null;
    		else
    			return r.records[0];
    	});
    }
}

module.exports = SkillGroupDa;