'use strict'
const roles = require('../models/roles');
const UserDa = require('./user');

class ApproverDa extends UserDa{

    findMyTeamUsers(id, onlyPendingApprove, includeWantSkills){
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
        if(onlyPendingApprove){
            matchType = '';
        }

        let wantCondition = 'where (k.want is null or k.want = false)';
        if(includeWantSkills){
            wantCondition = '';
        }

        let cmd = `match (n:${label})-[:${approverRelL}]->(me:${label}) where id(me) = {id}
                    match (n)-[:${officeRelL}]->(o),
                    (n)-[:${departmentRelL}]->(d),
                    (n)-[:${positionRelL}]->(p)
                    ${matchType} match (sg:${sgL})<-[:${sgRelL}]-(s:${skillL})<-[k:${kRelL}]-(n),
                    (sg)-[:${sgRelL}]->(sgp:${sgL})
                    ${wantCondition}
                    with n, o, d, p, sg, sgp, 
                        collect({id: id(s), name: s.name, knowledge: {id: id(k), level: k.level, want: k.want, approved: k.approved, approver: k.approverFullname}}) as skills,
                        sum(filter(s2 in s where ((s2.approved is null or s2.approved = false) and (s2.want is null or s2.want = false) )) as pendingApproveCount
                    return collect({    
                                id: id(n), username: n.username, type: n.type, email: n.email, 
                                fullname: n.fullname, roles: n.roles, phone: n.phone, image: n.image, disabled: n.disabled,
                                office: {id: id(o), name: o.name, country: o.country, acronym: o.acronym},
                                department: {id: id(d), name: d.name},
                                position: {id: id(p), name: p.name},
                                skillGroups: collect({
                                    id: id(sg), name: sg.name,
                                    parent: {id: id(sgp), name: sgp.name},
                                    skills: skills,
                                    pendingApproveCount: pendingApproveCount
                                })
                    })`
        let params = {id: neo4j.int(id)};
        return this._run(cmd, params)
            .then(r => this._cypher.parseResultRaw(r))

    }
    approveKnowledge(id, knowledgeId){

    }
}

module.exports = ApproverDa;