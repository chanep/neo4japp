'use strict'
const P = require('bluebird');
const roles = require('../models/roles');
const UserDa = require('./user');
const errors = require('../shared/errors');
const skillModel = require('../models/models').skill;
const skillGroupModel = require('../models/models').skillGroup;

class ResourceManagerDa extends UserDa{

    findUsersBySkill(skillIds, filters, skip, limit){
        let label = this.labelsStr;
        let officeRelL = this.model.getRelationByKey("office").label;
        let positionRelL = this.model.getRelationByKey("position").label;
        let approverRelL = this.model.getRelationByKey("approvers").label;
        let allocationRelL = this.model.getRelationByKey("allocation").label;
        let skillL = skillModel.labelsStr;
        let groupLbl = skillModel.getRelationByKey("group").label;
        let kRelL = this.model.getRelationByKey("knowledges").label;
        let interestedIn = this.model.getRelationByKey("interests").label;

        let params = {skillIds: skillIds, skip: skip, limit: limit};

        let whereOffices = '';
        
        filters = filters || {};
        if(filters.offices){
            params.offices = filters.offices;
            whereOffices = `and id(o) in {offices}`;
        }

        params.interests = [];
        if(filters.interests){
            params.interests = filters.interests;
        }

        let match = `match (n:${label})-[:${officeRelL}]->(o) where not(n.disabled) ${whereOffices}
                     match (n)-[:${positionRelL}]->(p)
                     optional match (n)-[k:${kRelL}]->(s:${skillL})-[:${groupLbl}]->(sg) where sg.type in ["tool", "skill"] and id(s) in {skillIds}
                     optional match (n)-[:${kRelL}]->(ind:${skillL})-[:${groupLbl}]->(sg2) where sg2.type in ["industry"] and id(ind) in {skillIds}
                     optional match (n)-[:${interestedIn}]->(interest) where id(interest) in {interests}
                     with n, o, p, k, s, ind, interest
                     where ((s is not null) or (ind is not null) or (interest is not null))
                     `;

        let countCmd = `${match} return count(distinct n) as count`;

        let cmd = `${match}
                    optional match (n)-[:${approverRelL}]->(a)
                    optional match (n)-[:${allocationRelL}]->(al)
                    with n, o, p, al, collect(distinct a) as approvers, 
                        filter(x IN collect(distinct {_:s, level: k.level, approved: k.approved, want: k.want}) where x._ is not null) as skills,
                        collect(distinct ind) as industries,
                        collect(distinct interest) as interests
                    with n, o, p, al, approvers, skills, industries, interests,
                    (reduce(acc = 0, wwh IN al.workingWeekHours | acc + wwh) - reduce(acc = 0, wh IN al.weekHours | acc + wh)) as freeHours,
                    ( reduce(acc = 0, s IN skills | acc + coalesce(s.level, 0)) + size(industries)*2 + size(interests) ) as score
                    order by score desc, freeHours desc, n.fullname asc
                    skip {skip} limit {limit}
                    return {    
                            id: id(n), username: n.username, type: n.type, email: n.email, phonelistId: n.phonelistId,
                            fullname: n.fullname, roles: n.roles, phone: n.phone, image: n.image, disabled: n.disabled, lastUpdate: n.lastUpdate,
                            office: {id: id(o), name: o.name, country: o.country, acronym: o.acronym},
                            allocation: al,
                            position: p,
                            approvers: approvers,
                            skills: skills,
                            industries: industries,
                            interests: interests,
                            score: score
                    }`;

        return this.queryPaged(cmd, countCmd, params);
    }

     /**
     * Returns true if the user is the resource manager of the employee
     * @param {number} userId
     * @param {number} employeeId
     */
    isResourceManagerOf(userId, employeeId){
        return this.relationshipExists(employeeId, "resourceManagers", userId);
    }

    topSkillSearches(limit, fromDate, toDate){
        limit = limit || 10;
        fromDate = fromDate || null;
        toDate = toDate || null;

        let skillL = skillModel.labelsStr;
        let groupLbl = skillModel.getRelationByKey("group").label;
        let parentGroupLbl = skillGroupModel.getRelationByKey("parent").label;
        let searchedLbl = this.model.getRelationByKey("searches").label;

        let cmd = `match (s:${skillL})-[:${groupLbl}]->(sg)-[:${parentGroupLbl}]->(psg) where sg.type in ["tool", "skill"] \n` +
        `match (s)<-[r:${searchedLbl}]-(rm) \n` +
        `where ({fromDate} is null or r.date >= {fromDate}) and ({toDate} is null or r.date <= {toDate}) \n` +
        `with s, sg, psg, count(r) as searches \n` +
        `order by searches desc \n limit {limit} \n` +
        `return {_:s, group: {_:sg, parent: psg}, searches: searches}`;

        let params = {limit: limit, fromDate: fromDate, toDate: toDate};

        return this.query(cmd, params);
    }

    skilledUsersByOffice(skillId){
        let label = this.labelsStr;
        let officeL = this.model.getRelationByKey("office").model.labelsStr;
        let works = this.model.getRelationByKey("office").label;
        let knows = this.model.getRelationByKey("knowledges").label;

        let cmd = `match (o:${officeL})<-[:${works}]-(u:${label})-[:${knows}]->(s) \n` +
        `where id(s) = {skillId} and not(u.disabled)\n` +
        `return {_:o, skilledUserCount: count(u)}`;

        let params = {skillId: skillId};

        return this.query(cmd, params);
    }
}

module.exports = ResourceManagerDa;