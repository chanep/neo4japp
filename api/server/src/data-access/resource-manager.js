'use strict'
const P = require('bluebird');
const neo4j = require('neo4j-driver').v1;
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
        let kRelL = this.model.getRelationByKey("knowledges").label;

        skillIds = skillIds.map(id => neo4j.int(id));
        let params = {skillIds: skillIds, skip: neo4j.int(skip), limit: neo4j.int(limit)};

        let whereOffices = '';
        filters = filters || {};
        if(filters.offices){
            params.offices = filters.offices.map(id => neo4j.int(id));;
            whereOffices = `where id(o) in {offices}`;
        }

        let match = `match (n:${label})-[k:${kRelL}]->(s:${skillL}) where not(n.disabled) and id(s) in {skillIds} and not(k.want)
                     match (n)-[:${officeRelL}]->(o) ${whereOffices}
                     match (n)-[:${positionRelL}]->(p)`;

        let countCmd = `${match} return count(distinct n) as count`;

        let cmd = `${match}
                    optional match (n)-[:${approverRelL}]->(a)
                    optional match (n)-[:${allocationRelL}]->(al)
                    with n, o, p, al, collect(a) as approvers, collect({_:s, level: k.level, approved: k.approved}) as skills
                    with n, o, p, al, approvers, skills, 
                    reduce(acc = 0, s IN filter(s IN skills WHERE s.approved) | acc + s.level) * 2 + reduce(acc = 0, s IN skills | acc + s.level) as score
                    order by score desc
                    skip {skip} limit {limit}
                    return {    
                                id: id(n), username: n.username, type: n.type, email: n.email, 
                                fullname: n.fullname, roles: n.roles, phone: n.phone, image: n.image, disabled: n.disabled,
                                office: {id: id(o), name: o.name, country: o.country, acronym: o.acronym},
                                allocation: al,
                                position: p,
                                approvers: approvers,
                                skills: skills,
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

        let cmd = `match (s:${skillL})-[:${groupLbl}]->(sg)-[:${parentGroupLbl}]->(psg), \n` +
        `(s)<-[r:${searchedLbl}]-(rm) \n` +
        `where ({fromDate} is null or r.date >= {fromDate}) and ({toDate} is null or r.date <= {toDate}) \n` +
        `with s, sg, psg, count(r) as searches \n` +
        `order by searches desc \n limit {limit} \n` +
        `return {_:s, group: {_:sg, parent: psg}, searches: searches}`;

        limit = neo4j.int(limit);
        if(fromDate)
            fromDate = neo4j.int(fromDate);
        if(toDate)
            toDate = neo4j.int(toDate);

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

        let params = {skillId: neo4j.int(skillId)};

        return this.query(cmd, params);
    }
}

module.exports = ResourceManagerDa;