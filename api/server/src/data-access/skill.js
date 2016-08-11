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

    checkOrCreateSkill(skill) {
        var queryStmt = "MATCH (skill:Skill)-[BELONGS_TO]->(group:SkillGroup) WHERE ID(group) = {groupID} AND skill.name = {skillName} AND skill.type = {skillType} RETURN skill";
        var params = {
            'groupID': skill.groupId,
            'skillName': skill.name,
            'skillType': skill.type
        };

        var resultReturn = {
            'action': '',
            'id': 0
        };

        return super._run(queryStmt, params).then(r => {
        	var skillDa = new SkillDa();

            if (r.records.length == 0) {
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
                resultReturn.id = r.records[0].get('skill')['identity'].low;
                return resultReturn;
            }
        });
    }
}

module.exports = SkillDa;