'use strict'
const BaseDa = require('./base-da');
const model = require('../models/models').skillGroup;
const neo4j = require('neo4j-driver').v1;

class SkillGroupDa extends BaseDa{
    constructor(tx){
        super(model, tx);
    }

    checkLevel1(level1) {
    	var queryStmt = "MATCH (level1:SkillGroup) WHERE NOT ((level1)-[:BELONGS_TO]->()) AND level1.name = {level1name} AND level1.type = {level1type} RETURN level1";
    	var params = {
    		'level1name': level1.name,
    		'level1type': level1.type
    	};

    	return super.query(queryStmt, params).then(r => {
    		var resultReturn = {
    			'action': '',
    			'id': 0
    		};

    		if (r.length == 0) {
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
					//let e = new errors.GenericError("Error importing skill group level 1:" + obj, err);
					//console.log(e);

					resultReturn.action = 'error';
					return resultReturn;
				});
    		}
    		else {
    			resultReturn.action = '';
    			resultReturn.id = r[0].id;
    			return resultReturn;
    		}
    	});
    }

    checkLevel2(levelsData) {
    	var queryStmt = "MATCH (child:SkillGroup)-[BELONGS_TO]->(parent:SkillGroup) WHERE ID(parent) = {parentID} AND child.name = {childName} AND child.type = {childType} RETURN child";
    	var params = {
    		'parentID': neo4j.int(levelsData.level1Id),
    		'childName': levelsData.name,
    		'childType': levelsData.type
    	};

		var resultReturn = {
			'action': '',
			'id': 0
		};

    	return super.query(queryStmt, params).then(r => {
    		if (r.length == 0) {
    			var newLevel2 = new SkillGroupDa();
				let obj = {
					'name': levelsData.name,
	        		'type': levelsData.type
	        	};

				return newLevel2.createAndRelate(obj, levelsData.level1Id, "skillparent", null).then(result => {
					resultReturn.id = result.id;
					resultReturn.action = 'inserted';

					return resultReturn;
				});
    		}
    		else {
    			resultReturn.action = '';
    			resultReturn.id = r[0].id;
    			return resultReturn;
    		}
    	}).catch(err => {
			let e = new errors.GenericError("Error importing skill group level 2:" + levelsData, err);
			console.log(e);

			resultReturn.action = 'error';
			return resultReturn;
    	});
    }
}

module.exports = SkillGroupDa;