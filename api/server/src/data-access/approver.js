'use strict'
const neo4j = require('neo4j-driver').v1;
const roles = require('../models/roles');
const UserDa = require('./user');
const skillModel = require('../models/models').skill;
const skillGroupModel = require('../models/models').skillGroup;

class ApproverDa extends UserDa{

    findMyTeamUsers(id, onlyPendingApproval, includeWantSkills){
        let label = this.labelsStr;
        let officeRelL = this.model.getRelationByKey("office").label;
        let departmentRelL = this.model.getRelationByKey("department").label;
        let positionRelL = this.model.getRelationByKey("position").label;
        let sgL = skillGroupModel.labelsStr;
        let skillL = skillModel.labelsStr;
        let sgRelL = skillModel.getRelationByKey("group").label;
        let kRelL = this.model.getRelationByKey("knowledges").label;
        let approverRelL = this.model.getRelationByKey("approvers").label;

        let matchType = 'optional';
        if(onlyPendingApproval){
            matchType = '';
        }

        let wantCondition = 'and (k.want is null or k.want = false)';
        if(includeWantSkills){
            wantCondition = '';
        }
        let cmd = `match (n:${label})-[:${approverRelL}]->(me:${label}) where id(me) = {id}
            match (n)-[:${officeRelL}]->(o),
            (n)-[:${departmentRelL}]->(d),
            (n)-[:${positionRelL}]->(p)
            ${matchType} match (sg:${sgL})<-[:${sgRelL}]-(s:${skillL})<-[k:${kRelL}]-(n),
            (sg)-[:${sgRelL}]->(sgp:${sgL})
            where (sg.type = 'tool' or sg.type = 'skill') ${wantCondition}
            with n, o, d, p, sg, sgp, 
                collect({_:s, knowledge: k}) as skills
            with n, o, d, p, sg, sgp, skills,
                (case when sg is not null then count(filter(s2 in skills where ((s2.knowledge.approved is null or s2.knowledge.approved = false) and (s2.knowledge.want is null or s2.knowledge.want = false)))) else 0 end) as pendingApprovalCount
            order by pendingApprovalCount DESC
            with n, o, d, p, (case when sg is not null then collect({_:sg, parent:sgp, skills: skills, pendingApprovalCount: pendingApprovalCount}) else [] end) as skillGroups,
                sum(pendingApprovalCount) as totalPendingApproval
            return {    
                        id: id(n), username: n.username, type: n.type, email: n.email, 
                        fullname: n.fullname, roles: n.roles, phone: n.phone, image: n.image, disabled: n.disabled,
                        office: {id: id(o), name: o.name, country: o.country, acronym: o.acronym},
                        department: d,
                        position: p,
                        skillGroups: skillGroups,
                        totalPendingApproval: totalPendingApproval
            } order by totalPendingApproval DESC`
        let params = {id: neo4j.int(id)};
        return this._run(cmd, params)
            .then(r => this._cypher.parseResultArrayRaw(r))

    }
    approveKnowledge(id, knowledgeId){

    }
}

module.exports = ApproverDa;