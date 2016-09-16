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
    findByUsername(username){
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

    addResourceManager(id, managerId){
        return this.relate(id, managerId, 'resourceManagers');
    }

    addClient(id, clientId){
        return this.relate(id, clientId, 'clients');
    }
    clearClients(id){
        return this.deleteAllRelationships(id, 'clients');
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
    setKnowledge(id, skillId, level, want){
        level = want? null : level;
        let knowledgeData = {
            level: level,
            want: want,
            approved: null,
            approverId: null,
            approvedFullname: null
        }

        return this.relate(id, skillId, 'knowledges', knowledgeData, true);
    }
    setAllocation(id, allocationData){
        return this.setChild(id, "allocation", allocationData);
    }
}

module.exports = UserDa;