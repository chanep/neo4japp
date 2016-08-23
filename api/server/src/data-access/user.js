'use strict'
const BaseDa = require('./base-da');
const model = require('../models/models').user;
const roles = require('../models/roles');
const AllocationDa = require('./allocation');

class UserDa extends BaseDa{
    constructor(tx){
        super(model, tx);
    }
    getByUsername(username){
        return this.findOne({username: username});
    }
    setOffice(id, officeId){
        return this.relate(id, officeId, 'office');
    }
    setDepartment(id, departmentId){
        return this.relate(id, departmentId, 'department');
    }
    setPosition(id, positionId){
        return this.relate(id, positionId, 'position');
    }
    addApprover(id, approverId){
        return this.relate(id, approverId, 'approvers');
    }
    clearApprovers(id){
        return this.deleteAllRelationships(id, 'approvers');
    }
    /**
     * Update all users role 'approver' based on relationships 'APPROVED_BY'
     */
    updateApproverRole(){
        let updated = 0;
        let label = this.labelsStr;
        let rel = this.model.getRelationByKey("approvers").label;
        let role = roles.approver;
        let cmd1 = `MATCH (a:${label})<-[:${rel}]-(:${label}) WHERE (a.roles IS NULL) OR NONE(role IN a.roles WHERE role = {role})
                WITH DISTINCT a
                SET a.roles = a.roles + {role}
                return count(a)`;
        let cmd2 = `MATCH (a:${label}) WHERE NOT( (a)<-[:${rel}]-(:${label}) ) AND ANY(role IN a.roles WHERE role = {role})
                WITH DISTINCT a
                SET a.roles = FILTER(role IN a.roles WHERE role <> {role})
                return count(a)`;
        return this._run(cmd1, {role: role})
            .then(r => this._cypher.parseIntResult(r))
            .then(count => {
                updated += count;
                return this._run(cmd2, {role: role})
            })
            .then(r => this._cypher.parseIntResult(r))
            .then(count => {
                updated += count;
                return updated;
            })
    }
    setKnowledge(id, skillId, knowledgeData){
        return this.relate(id, skillId, 'knowledges', knowledgeData, true);
    }
    setAllocation(id, allocationData){
        return this.setChild(id, "allocation", allocationData);
    }
}

module.exports = UserDa;