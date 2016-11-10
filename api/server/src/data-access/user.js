'use strict'
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
        let rmRelL = this.model.getRelationByKey("resourceManagers").label;
        let sgL = skillGroupModel.labelsStr;
        let skillL = skillModel.labelsStr;
        let sgRelL = skillModel.getRelationByKey("group").label;
        let kRelL = this.model.getRelationByKey("knowledges").label;
        let interestRelL = this.model.getRelationByKey("interests").label;
        let allocationRelL = this.model.getRelationByKey("allocation").label;

        let cmd = `match (n:${label}) where id(n) = {id}
                    match (n)-[:${officeRelL}]->(o),
                    (n)-[:${departmentRelL}]->(d),
                    (n)-[:${positionRelL}]->(p)

                    optional match (n)-[:${approverRelL}]->(a)
                    optional match (a)-[:${departmentRelL}]->(ad)
                    optional match (a)-[:${positionRelL}]->(ap)

                    optional match (n)-[:${rmRelL}]->(rm)
                    optional match (rm)-[:${departmentRelL}]->(rmd)
                    optional match (rm)-[:${positionRelL}]->(rmp)

                    optional match (n)-[:${allocationRelL}]->(al)
                    optional match (n)-[:${clientRelL}]->(c)
                    optional match (n)-[:${interestRelL}]->(i)
                    optional match (n)-[:${kRelL}]->(ind)-[:${sgRelL}]->(sg) where sg.type = 'industry' 
                    optional match (n)-[kt:${kRelL}]->(s)-[:${sgRelL}]->(sg2) where sg2.type in ['tool', 'skill'] and kt.want = false
                    optional match (n)-[ku:${kRelL}]->(su)-[:${sgRelL}]->(sg3) where sg3.type in ['tool', 'skill'] and (ku.approved is null or ku.approved = false) and ku.want = false
                    with n, o, d, p, al, collect(distinct {_:a, department: ad, position: ap}) as approvers, collect(distinct {_:rm, department: rmd, position: rmp}) as resourceManagers, collect(distinct c) as clients, collect(distinct i) as interests,
                        collect(distinct ind) as industries, count(distinct s) as skillCount, count(distinct su) as unapprovedSkillCount
                    return {    
                                id: id(n), username: n.username, type: n.type, email: n.email, phonelistId: n.phonelistId,
                                fullname: n.fullname, roles: n.roles, phone: n.phone, image: n.image, disabled: n.disabled, lastUpdate: n.lastUpdate,
                                office: {id: id(o), name: o.name, country: o.country, acronym: o.acronym},
                                department: {id: id(d), name: d.name},
                                position: {id: id(p), name: p.name},
                                approvers: approvers,
                                resourceManagers: resourceManagers,
                                allocation: al,
                                clients: clients,
                                interests: interests,
                                industries: industries,
                                skillCount: skillCount,
                                unapprovedSkillCount: unapprovedSkillCount
                    }`
        let params = {id: id};
        return this._run(cmd, params)
            .then(r => this._cypher.parseResultRaw(r, this.model.schema))

    }

    findUsersWithSimilarSkills(userId, limit){
        limit = limit || 10;
        let label = this.labelsStr;
        let officeRelL = this.model.getRelationByKey("office").label;
        let departmentRelL = this.model.getRelationByKey("department").label;
        let positionRelL = this.model.getRelationByKey("position").label;

        let skillL = skillModel.labelsStr;
        let kRelL = this.model.getRelationByKey("knowledges").label;

        let cmd = `match (n2:${label}) where id(n2) = {userId} and not(n2.disabled)
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

        let params = {userId: userId, limit: limit};
        return this.query(cmd, params);
    }
	/**
	 * Return user skill tree
	 * @param {number} userId
	 * @param {boolean} allSkills - returns the full skill tree (even skills user doesn't have kinowledge in)
	 * @returns Skill tree
	 * @memberOf UserDa
	 */
	findUserSkills(userId, allSkills){
        let label = this.labelsStr;
        let sgL = skillGroupModel.labelsStr;
        let parent = skillGroupModel.getRelationByKey("parent").label;
        let skillL = skillModel.labelsStr;
        let group = skillModel.getRelationByKey("group").label;
        let kRelL = this.model.getRelationByKey("knowledges").label;
        let operator = '';
        if(allSkills)
            operator = 'optional'
		let cmd = `match (g:${sgL})<-[:${parent}]-(cg:${sgL})<-[:${group}]-(s:${skillL}) where g.type IN ['skill', 'tool']
            ${operator} match (s)<-[k:${kRelL}]-(n:${label}) where id(n) = {userId}
            with g, cg, s, k
            order by s.name
			with g, cg, collect({_:s, knowledge: k}) as skills 
            order by cg.name
			return {_:g, children: collect({_:cg, skills: skills})} as result
            order by result._.name
            `;
        let params = {userId: userId};
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
    deleteKnowledge(userId, skillId){
        return this.deleteRelationship(userId, skillId, 'knowledges');
    }
    setAllocation(userId, allocationData){
        return this.setChild(userId, "allocation", allocationData);
    }
    addSkillSearch(userId, skillId, date){
        return this.relate(userId, skillId, 'searches', {date: date}, false);
    }
}

module.exports = UserDa;