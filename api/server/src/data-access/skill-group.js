'use strict'
const BaseDa = require('./base-da');
const model = require('./models').skillGroup;

class SkillGroupDa extends BaseDa{
    constructor(tx){
        super(model, tx);
    }

    checkLevel1(level1) {
    	var queryStmt = "MATCH (level1:SkillGroup) WHERE NOT ((level1)-[:BELLONGS_TO]->()) AND level1.name = {level1name} AND level1.type = {level1type} RETURN level1";
    	var params = {
    		'level1name': level1.name,
    		'level1type': level1.type
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
    			resultReturn.id = r.records[0].get('level1')['identity'].low;
    			return resultReturn;
    		}
    	});
    }

    checkLevel2(levelsData) {
    	var queryStmt = "MATCH (level2:SkillGroup)-[BELLONGS_TO]->(level1:SkillGroup) WHERE level1.id = {level1id} AND level2.name = {level2name} AND level2.type = {level2type} RETURN level2";
    	var params = {
    		'level1id': levelsData.level1Id,
    		'level2name': levelsData.level2name,
    		'level2type': levelsData.level2type
    	};
    	return super._run(queryStmt, params).then(r => {
    		var resultReturn = {
    			'action': '',
    			'id': 0
    		};

    		if (r.records.length == 0) {
    			var newLevel2 = new SkillGroupDa();
				let obj = {
					'name': levelsData.level2name,
	        		'type': levelsData.level2type
	        	};

				return newLevel2.createAndRelate(obj, levelsData.level1Id, "skillparent", null).then(result => {
					resultReturn.id = result.id;
					resultReturn.action = 'inserted';

					return resultReturn;
				}).catch(err => {
					let e = new errors.GenericError("Error importing skill group level 2:" + obj, err);
					console.log(e);

					resultReturn.action = 'error';
					return resultReturn;
				});
    		}
    		else {
    			resultReturn.action = '';    			
    			resultReturn.id = r.records[0].get('level2')['identity'].low;
    			return resultReturn;
    		}
    	});
    }
}

module.exports = SkillGroupDa;