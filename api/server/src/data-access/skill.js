'use strict'
const BaseDa = require('./base-da');
const model = require('../models/models').skill;
const neo4j = require('neo4j-driver').v1;

class SkillDa extends BaseDa{
    constructor(tx){
        super(model, tx);
    }

    findByTerm(term, type, limit){
        let query = {name: {$ilike: `%${term}%`}};
        if(type)
            query.includes = [{key: "group", query: {type: type}, notInclude: true}];
        if(limit)
            query.paged = {skip: 0, limit: limit};
        
        query.orderBy = "name ASC";

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
            'groupID': neo4j.int(skill.groupId),
            'skillName': skill.name
        };

        var resultReturn = {
            'action': '',
            'id': 0
        };

        return super.query(queryStmt, params).then(r => {
        	var skillDa = new SkillDa();

            if (r.length == 0) {
                var newSkill = new SkillDa();
                let obj = {
                    'name': skill.name
                };

                return skillDa.createAndRelate(obj, skill.groupId).then(result => {
                    resultReturn.id = result.id;
                    resultReturn.action = 'inserted';

                    return resultReturn;
                }).catch(err => {
                    let e = new errors.GenericError("Error creating skill" + obj, err);
                    console.log(e);

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

}

module.exports = SkillDa;