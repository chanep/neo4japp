'use strict'
const neo4j = require('neo4j-driver').v1;
const BaseDa = require('./base-da');
const model = require('../models/models').user;
const roles = require('../models/roles');
const AllocationDa = require('./allocation');
const InterestDa = require('./interest');
const skillModel = require('../models/models').skill;
const skillGroupModel = require('../models/models').skillGroup;

class UserDa extends BaseDa{
    constructor(tx){
        super(model, tx);
    }
    /**
     * Return User with office, department, position and knowledged
     * @param {number} id user id
     */
    findByIdFull(id){
        let label = this.labelsStr;
        let officeRelL = this.model.getRelationByKey("office").label;
        let departmentRelL = this.model.getRelationByKey("department").label;
        let positionRelL = this.model.getRelationByKey("position").label;
        let clientRelL = this.model.getRelationByKey("clients").label;
        let approverRelL = this.model.getRelationByKey("approvers").label;
        let sgL = skillGroupModel.labelsStr;
        let skillL = skillModel.labelsStr;
        let sgRelL = skillModel.getRelationByKey("group").label;
        let kRelL = this.model.getRelationByKey("knowledges").label;
        let interestRelL = this.model.getRelationByKey("interests").label;

        let cmd = `match (n:${label}) where id(n) = {id}
                    match (n)-[:${officeRelL}]->(o),
                    (n)-[:${departmentRelL}]->(d),
                    (n)-[:${positionRelL}]->(p)
                    optional match (sg:${sgL})<-[:${sgRelL}]-(s:${skillL})<-[k:${kRelL}]-(n),
                        (sg)-[:${sgRelL}]->(sgp:${sgL})
                    optional match (n)-[:${approverRelL}]->(a)
                    optional match (n)-[:${clientRelL}]->(c)
                    optional match (n)-[:${interestRelL}]->(i)
                    with n, o, d, p, collect(distinct a) as approvers, collect(distinct c) as clients, collect(distinct i) as interests, sg, sgp, 
                        collect(distinct {id: id(s), name: s.name, knowledge: {id: id(k), level: k.level, want: k.want, approved: k.approved, approver: k.approverFullname}}) as skills
                    return {    
                                id: id(n), username: n.username, type: n.type, email: n.email, 
                                fullname: n.fullname, roles: n.roles, phone: n.phone, image: n.image, disabled: n.disabled,
                                office: {id: id(o), name: o.name, country: o.country, acronym: o.acronym},
                                department: {id: id(d), name: d.name},
                                position: {id: id(p), name: p.name},
                                approvers: approvers,
                                clients: clients,
                                interests: interests,
                                skillGroups: collect(
                                    case when sg is not null then {
                                        id: id(sg), name: sg.name,
                                        parent: {id: id(sgp), name: sgp.name},
                                        skills: skills
                                    } else null end
                                )
                    }`
        let params = {id: neo4j.int(id)};
        return this._run(cmd, params)
            .then(r => this._cypher.parseResultRaw(r))

    }

    findUsersWithSimilarSkills(userId, limit){
        limit = limit || 10;
        let label = this.labelsStr;
        let officeRelL = this.model.getRelationByKey("office").label;
        let departmentRelL = this.model.getRelationByKey("department").label;
        let positionRelL = this.model.getRelationByKey("position").label;

        let skillL = skillModel.labelsStr;
        let kRelL = this.model.getRelationByKey("knowledges").label;

        let cmd = `match (n2:${label}) where id(n2) = {userId}
        match (n)-[:${officeRelL}]->(o),
        (n)-[:${departmentRelL}]->(d),
        (n)-[:${positionRelL}]->(p),
        (n)-[k1:${kRelL}]->(s:${skillL})<-[k2:${kRelL}]-(n2) where not(n.disabled) and not(k2.want) and not(k1.want)
        with n, o, d, p, collect({level1: k1.level, level2: k2.level}) as knowledges
        with n, o, d, p, reduce(acc = 0, k in knowledges | acc + (5 - abs(k.level1 - k.level2))) as score
        order by score desc limit {limit}
        return {    
                id: id(n), username: n.username, email: n.email, 
                fullname: n.fullname, image: n.image,
                office: {id: id(o), name: o.name, country: o.country, acronym: o.acronym},
                department: {id: id(d), name: d.name},
                position: {id: id(p), name: p.name},
                similitudeScore: score
        }`

        let params = {userId: neo4j.int(userId), limit: neo4j.int(limit)};
        return this.query(cmd, params);
    }
	/**
	 * Return the full skillgroup/skill tree. Skill is attached with the corresponding knwoledge if the user have that skill
	 */
	fullSkillTreeWithUserKnowledges(userId){
        let label = this.labelsStr;
        let sgL = skillGroupModel.labelsStr;
        let sgParentRelL = skillGroupModel.getRelationByKey("parent").label;
        let skillL = skillModel.labelsStr;
        let sgRelL = skillModel.getRelationByKey("group").label;
        let kRelL = this.model.getRelationByKey("knowledges").label;
		let cmd = `match (g:${sgL})<-[:${sgParentRelL}]-(cg:${sgL})<-[:${sgRelL}]-(s:${skillL})
            optional match (s)<-[k:${kRelL}]-(n:${label}) where id(n) = {userId}
            with g, cg, s, k
            order by s.name
			with g, cg, collect({_:s, knowledge: k}) as skills 
            order by cg.name
			return {_:g, children: collect({_:cg, skills: skills})} as result
            order by result._.name
            `;
        let params = {userId: neo4j.int(userId)};
		return this.query(cmd, params, null);
	}
    findByUsername(username){
        return this.findOne({username: username});
    }

    setOffice(userId, officeId){
        return this.relate(userId, officeId, 'office');
    }
    setDepartment(userId, departmentId){
        return this.relate(userId, departmentId, 'department');
    }
    setPosition(userId, positionId){
        return this.relate(userId, positionId, 'position');
    }

    addApprover(userId, approverId){
        return this.relate(userId, approverId, 'approvers');
    }
    clearApprovers(userId){
        return this.deleteAllRelationships(userId, 'approvers');
    }

    addResourceManager(userId, managerId){
        return this.relate(userId, managerId, 'resourceManagers');
    }
    clearResourceManagers(userId){
        return this.deleteAllRelationships(userId, 'resourceManagers');
    }

    addClient(userId, clientId){
        return this.relate(userId, clientId, 'clients');
    }
    clearClients(userId){
        return this.deleteAllRelationships(userId, 'clients');
    }

    addInterest(userId, interestName){
        let interestDa = new InterestDa();
        return interestDa.findOrCreate(interestName)
            .then(i => {
                return this.relate(userId, i.id, "interests")
                    .then(() => i);
            });
    }

    removeInterest(userId, interestId){
        return this.deleteRelationship(userId, interestId, "interests");
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
                SET a.roles = CASE WHEN (a.roles IS NULL) then [{role}] ELSE a.roles + {role} END
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

    /**
     * Update all users role 'resourceManager' based on relationships 'R_MANAGED_BY'
     */
    updateResourceManagerRole(){
        let updated = 0;
        let label = this.labelsStr;
        let rel = this.model.getRelationByKey("resourceManagers").label;
        let role = roles.resourceManager;
        let cmd1 = `MATCH (a:${label})<-[:${rel}]-(:${label}) WHERE (a.roles IS NULL) OR NONE(role IN a.roles WHERE role = {role})
                WITH DISTINCT a
                SET a.roles = CASE WHEN (a.roles IS NULL) then [{role}] ELSE a.roles + {role} END
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

    setKnowledge(userId, skillId, level, want){
        level = want? null : level;
        let knowledgeData = {
            level: level,
            want: want,
            approved: null,
            approverId: null,
            approvedFullname: null
        }

        return this.relate(userId, skillId, 'knowledges', knowledgeData, true);
    }
    setAllocation(userId, allocationData){
        return this.setChild(userId, "allocation", allocationData);
    }
    addSkillSearch(userId, skillId, date){
        return this.relate(userId, skillId, 'searches', {date: date}, false);
    }
}

module.exports = UserDa;