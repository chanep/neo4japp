'use strict'
const P = require('bluebird');
const roles = require('../models/roles');
const UserDa = require('./user');
const errors = require('../shared/errors');
const skillModel = require('../models/models').skill;
const skillGroupModel = require('../models/models').skillGroup;

class ApproverDa extends UserDa{

    findMyTeamUsers(approverId, onlyPendingApproval, includeWantSkills){
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
        let cmd = `match (n:${label})-[:${approverRelL}]->(me:${label}) where id(me) = {id} and not(n.disabled)
            match (n)-[:${officeRelL}]->(o),
            (n)-[:${departmentRelL}]->(d),
            (n)-[:${positionRelL}]->(p)
            ${matchType} match (sg:${sgL})<-[:${sgRelL}]-(s:${skillL})<-[k:${kRelL}]-(n),
            (sg)-[:${sgRelL}]->(sgp:${sgL})
            where (sg.type = 'tool' or sg.type = 'skill') ${wantCondition}
            with n, o, d, p, sg, sgp,
                collect({_:s, knowledge: k}) as skills
            with n, o, d, p, sg, sgp, skills,
                (case when sg is not null then size(filter(s2 in skills where ((s2.knowledge.approved is null or s2.knowledge.approved = false) and (s2.knowledge.want is null or s2.knowledge.want = false)))) else 0 end) as pendingApprovalCount
            order by pendingApprovalCount DESC
            with n, o, d, p, (case when sg is not null then collect({_:sg, parent:sgp, skills: skills, pendingApprovalCount: pendingApprovalCount}) else [] end) as skillGroups,
                sum(pendingApprovalCount) as totalPendingApproval
            order by totalPendingApproval DESC, n.fullname ASC
            return {
                        id: id(n), username: n.username, type: n.type, email: n.email,
                        fullname: n.fullname, roles: n.roles, phone: n.phone, image: n.image, disabled: n.disabled, lastUpdate: n.lastUpdate,
                        office: {id: id(o), name: o.name, country: o.country, acronym: o.acronym},
                        department: d,
                        position: p,
                        skillGroups: skillGroups,
                        totalPendingApproval: totalPendingApproval
            }`
        let params = {id: approverId};
        return this.query(cmd, params);

    }

    /**
    * Find the usernames (primarily) as well as ids and emails of a given user. For external use. 
    */
    findDirectReports(approverUsername){
        let label = this.labelsStr;
        let approverRelL = this.model.getRelationByKey("approvers").label;
        console.log(approverUsername);

        let cmd = `match (n:${label})-[:${approverRelL}]->(me:${label}) 
            where me.username = {username}
            return {
                id: id(n), username: n.username, email: n.email
            }`
        let params = {username: approverUsername};
        return this.query(cmd, params);
    }


    /**
     * Returns true if the user is the approver of the employee
     * @param {number} userId
     * @param {number} employeeId
     * @param {boolean} deep if deep is true, approver of approver of is considered also approver
     * @returns
     * @memberOf ApproverDa
     */
    isApproverOf(userId, employeeId, deep){
        if(!deep)
            return this.relationshipExists(employeeId, "approvers", userId);

        let label = this.labelsStr;
        let approverRelL = this.model.getRelationByKey("approvers").label;
        let cmd = `match (u:${label})<-[:${approverRelL}*1..15]-(e:${label})
            where id(u) = {userId} and id(e) = {employeeId}
            return (count(u) <> 0)`;
        let params = {userId: userId, employeeId: employeeId};
        return this.query(cmd, params)
            .then(result => result[0]);;
    }
     /**
     * Returns true if the user is one of possible the approvers of a knowledge
     * @param {number} userId
     * @param {number} knowledgeId
     */
    isApproverOfKnowledge(userId, knowledgeId){
        if(!userId)
            return P.reject(new errors.GenericError(`ApproverDa.isApproverOfKnowledge userId undefined`));
        if(!knowledgeId)
            return P.reject(new errors.GenericError(`ApproverDa.isApproverOfKnowledge knowledgeId undefined`));
        let label = this.labelsStr;
        let knowledgeRelL = this.model.getRelationByKey("knowledges").label;
        let approverRelL = this.model.getRelationByKey("approvers").label;

        let cmd = `match (n:${label})<-[:${approverRelL}]-(:${label})-[k:${knowledgeRelL}]->()
            where id(n) = {userId} and id(k) = {knowledgeId}
            return (count(n) <> 0)`;
        let params = {userId: userId, knowledgeId: knowledgeId};
        return this.query(cmd, params)
            .then(result => result[0]);
    }
    /**
     * An Approver (manager) approves (verify) a employee's skill knowledge
     * @param {number} approverId
     * @param {number} knowledgeId
     * @param {boolean} disapproved - True for delete approval
     * @returns knowledge data
     */
    approveKnowledge(approverId, knowledgeId, disapprove){
        return this.findById(approverId)
            .then(approver => {
                if(!approver)
                    throw new errors.GenericError("Error approving knowledge. User not found, id: " + approverId);
                let kData = {
                    approverId: approverId,
                    approverFullname: approver.fullname,
                    approved: !disapprove
                }
                return this.updateRelationship(knowledgeId, "knowledges", kData, true);
            })
    }


    /**
     * Find all approvers with their employees pending of approval
     * @memberOf ApproverDa
     */
    findApproversWithPendingApprovals(){
        const userL = this.labelsStr;
        const skillL = skillModel.labelsStr;
        const groupL = skillModel.getRelationByKey("group").label;
        const sgL = skillGroupModel.labelsStr;
        const knowledgesL = this.model.getRelationByKey("knowledges").label;
        const approversL = this.model.getRelationByKey("approvers").label;

        const cmd = `
            match (a:${userL})<-[:${approversL}]-(e:${userL}),
            (e)-[k:${knowledgesL}]->(s:${skillL})-[:${groupL}]-(sg:${sgL})
            where not(a.disabled) and not(e.disabled) and (a.lastLogin <= e.lastSkillUpdate) and (sg.type = 'tool' or sg.type = 'skill') and (k.approved is null or k.approved = false)
            with a, e
            order by e.fullname
            with a, collect(distinct {id: id(e), fullname: e.fullname, email: e.email, lastSkillUpdate: e.lastSkillUpdate}) as pendingApprovalEmployees
            return {
                id: id(a), username: a.username, lastLogin:a.lastLogin, first: a.first, email: a.email, fullname: a.fullname,
                pendingApprovalEmployees: pendingApprovalEmployees
            }`
        const params = {};
        return this.query(cmd, params);
    }
}

module.exports = ApproverDa;
