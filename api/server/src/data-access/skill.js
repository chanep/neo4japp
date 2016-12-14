'use strict'
const BaseDa = require('./base-da');
const model = require('../models/models').skill;
const P = require('bluebird');
const errors = require('../shared/errors');

class SkillDa extends BaseDa{
    constructor(tx){
        super(model, tx);
    }

    findByTerm(term, type, limit){
        let query = {name: {$ilike: `%${term}%`}};
        if(type){
            if(!Array.isArray(type))
                type = [type];
            query.includes = [{key: "group", query: {type: {$in: type}}, notInclude: true}];
        }
            
        if(limit)
            query.paged = {skip: 0, limit: limit};
        
        query.orderBy = "name ASC";

        return this.find(query);
    }

    /**
	 * Find all skills of a given group type
	 * @param {string} type - Skill Group type
	 * @memberOf SkillGroupDa
	 */
	findByType(type){
        if(!type)
            return P.reject(new errors.GenericError(`SkillDa.findByType type undefined`));
        let query = { includes: [{key: "group", query: {type: type}, notInclude: true}] };
        return this.find(query);
	}

    createAndRelate(data, groupId){
        return super.createAndRelate(data, groupId, "group");
    }

    checkOrCreateSkill(skill) {
        let modelName = this.model.labelsStr;
        let relationName = this.model.getRelationByKey("group").label;
        let relatedModelName = this.model.getRelationByKey("group").model.labelsStr;
        var queryStmt = `MATCH (skill:${modelName})-[:${relationName}]->(group:${relatedModelName}) WHERE ID(group) = {groupID} AND skill.name = {skillName} RETURN skill`;
        var params = {
            'groupID': skill.groupId,
            'skillName': skill.name
        };

        return this.query(queryStmt, params).then(skills => {
            if (skills.length == 0) {
                let data = {
                    name: skill.name,
                    description: skill.description
                };
                return this.createAndRelate(data, skill.groupId)
                    .then(result => {
                        let resultReturn = {
                            id: result.id,
                            action: 'inserted'
                        };
                        return resultReturn;
                    }).catch(err => {
                        let e = new errors.GenericError("Error creating skill" + obj, err);
                        let resultReturn = {
                            action: 'error'
                        };
                        return resultReturn;
                    });
            }
            else {
                return this.update({id: skills[0].id, description: skill.description}, true)
                    .then(result => {
                        let resultReturn = {
                            id: skills[0].id,
                            action: 'updated'
                        };
                        return resultReturn;
                    }).catch(err => {
                        let e = new errors.GenericError("Error updating skill", err);
                        let resultReturn = {
                            action: 'error'
                        };
                        return resultReturn;
                    });
            }
        });
    }

}

module.exports = SkillDa;