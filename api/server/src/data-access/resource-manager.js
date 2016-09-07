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

        let match = `match (n:${label})-[k:${kRelL}]->(s:${skillL}) where not(n.disabled) and id(s) in {skillIds} and not(k.want),
                    (n)-[:${officeRelL}]->(o) ${whereOffices},
                    (n)-[:${positionRelL}]->(p)`;

        let countCmd = `${match} return count(n) as count`;

        let cmd = `${match},
                    optional match (n)-[:${approverRelL}]->(a)
                    optional match (n)-[:${allocationRelL}]->(al)
                    with n, o, p, collect(a) as approvers, collect({_:s, level: k.level, approved: k.approved}) as skills
                    with n, o, p, approvers, skills, 
                        (sum([s IN skills WHERE s.approved | s.level]) * 2 + sum([s IN skills | s.level])) as score
                    order by score desc
                    skip {skip} limit {limit}
                    return {    
                                id: id(n), username: n.username, type: n.type, email: n.email, 
                                fullname: n.fullname, roles: n.roles, phone: n.phone, image: n.image, disabled: n.disabled,
                                office: {id: id(o), name: o.name, country: o.country, acronym: o.acronym},
                                department: {id: id(d), name: d.name},
                                allocation: al,
                                position: p,
                                approvers: approvers,
                                skills: skills,
                                score: score
                    }`;

        return this.queryPaged(cmd, countCmd, params);
    }

}

module.exports = ResourceManagerDa;