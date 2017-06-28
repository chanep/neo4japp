'use strict'
const _ = require('lodash');
const P = require('bluebird');
const roles = require('../models/roles');
const UserDa = require('./user');
const errors = require('../shared/errors');
const skillModel = require('../models/models').skill;
const skillGroupModel = require('../models/models').skillGroup;

class ResourceManagerDa extends UserDa{

  findMyResourceUsers(resourceManagerId, onlyPendingApproval, includeWantSkills){
      let label = this.labelsStr;
      let officeRelL = this.model.getRelationByKey("office").label;
      let departmentRelL = this.model.getRelationByKey("department").label;
      let positionRelL = this.model.getRelationByKey("position").label;
      let sgL = skillGroupModel.labelsStr;
      let skillL = skillModel.labelsStr;
      let sgRelL = skillModel.getRelationByKey("group").label;
      let kRelL = this.model.getRelationByKey("knowledges").label;
      let resourceManagersRelL = this.model.getRelationByKey("resourceManagers").label;

      let matchType = 'optional';
      if(onlyPendingApproval){
          matchType = '';
      }

      let wantCondition = 'and (k.want is null or k.want = false)';
      if(includeWantSkills){
          wantCondition = '';
      }
      let cmd = `match (n:${label})-[:${resourceManagersRelL}]->(me:${label}) where id(me) = {id} and not(n.disabled)
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
      let params = {id: resourceManagerId};
      return this.query(cmd, params);

  }

    findUsersBySkill(skillIds, filters, skip, limit, orderBy){
        let label = this.labelsStr;
        let officeRelL = this.model.getRelationByKey("office").label;
        let positionRelL = this.model.getRelationByKey("position").label;
        let approverRelL = this.model.getRelationByKey("approvers").label;
        let allocationRelL = this.model.getRelationByKey("allocation").label;
        let skillL = skillModel.labelsStr;
        let groupLbl = skillModel.getRelationByKey("group").label;
        let kRelL = this.model.getRelationByKey("knowledges").label;
        let interestedIn = this.model.getRelationByKey("interests").label;
        let workedFor = this.model.getRelationByKey("clients").label;

        let params = {skillIds: skillIds, skip: skip, limit: limit};

        let defaultFilters = {
            offices: null,
            levels: null,
            interests: [],
            clients: []
        };

        params = _.merge(params, defaultFilters, filters);

        orderBy = orderBy || "relevance";
        let order = "order by score desc, freeHours desc, n.fullname asc";
        switch (orderBy) {
            case "relevance":
                break;
            case "fullname_asc":
                order = "order by n.fullname asc, score desc, freeHours desc";
                break;
            case "fullname_desc":
                order = "order by n.fullname desc, score desc, freeHours desc";
                break;
            case "office_asc":
                order = "order by o.acronym asc, score desc, freeHours desc, n.fullname asc";
                break;
            case "office_desc":
                order = "order by o.acronym desc, score desc, freeHours desc, n.fullname asc";
                break;
            case "matchedItems":
                order = "order by matchedItems desc, score desc, freeHours desc, n.fullname asc";
                break;
            case "allocation":
                order = "order by freeHours desc, score desc, n.fullname asc";
                break;
            default:
                break;
        }

        let match = `match (n:${label})-[:${officeRelL}]->(o) where not(n.disabled)
                         and ({levels} is null or n.level in {levels}) and ({offices} is null or id(o) in {offices})
                     match (n)-[:${positionRelL}]->(p)
                     optional match (n)-[k:${kRelL}]->(s:${skillL})-[:${groupLbl}]->(sg) where sg.type in ["tool", "skill"] and id(s) in {skillIds}
                     optional match (n)-[:${kRelL}]->(ind:${skillL})-[:${groupLbl}]->(sg2) where sg2.type in ["industry"] and id(ind) in {skillIds}
                     optional match (n)-[:${interestedIn}]->(interest) where id(interest) in {interests}
                     optional match (n)-[:${workedFor}]->(client) where id(client) in {clients}
                     with n, o, p, k, s, ind, interest, client
                     where ((s is not null) or (ind is not null) or (interest is not null) or (client is not null))
                     `;

        let countCmd = `${match} return count(distinct n) as count`;

        let cmd = `${match}
                    optional match (n)-[:${approverRelL}]->(a)
                    optional match (n)-[:${allocationRelL}]->(al)
                    with n, o, p, al, collect(distinct a) as approvers,
                        filter(x IN collect(distinct {id: id(s), name: s.name, level: k.level, approved: k.approved, want: k.want}) where x.id is not null) as skills,
                        collect(distinct ind) as industries,
                        collect(distinct interest) as interests,
                        collect(distinct client) as clients
                    with n, o, p, al, approvers, skills, industries, interests, clients,
                    ( reduce(acc = 0, wwh IN al.workingWeekHours | acc + wwh) - reduce(acc = 0, wh IN al.weekHours | acc + wh)) as freeHours,
                    ( reduce(acc = 0, s IN skills | acc + coalesce(s.level, 0)) + size(industries)*2 + size(interests) ) as score,
                    ( size({skillIds}) + size({interests}) + size({clients}) ) as searchedItems,
                    ( size(filter(s in skills where not(s.want))) + size(industries) + size(interests) + size(clients) ) as matchedItems
                    ${order}
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
                            clients: clients,
                            searchedItems: searchedItems,
                            matchedItems: matchedItems,
                            score: score
                    }`;

        return this.queryPaged(cmd, countCmd, params);
    }

    findSkillByUsers(officeIds, noSkills, filters, skip, limit, orderBy){
        let label = this.labelsStr;
        let officeRelL = this.model.getRelationByKey("office").label;
        let skillL = skillModel.labelsStr;
        let groupLbl = skillModel.getRelationByKey("group").label;
        let kRelL = this.model.getRelationByKey("knowledges").label;

        let params = {officeIds: officeIds, skip: skip, limit: limit};

        let defaultFilters = {
            officeIds: null,
            noSkills: false
        };

        params = _.merge(params, defaultFilters, filters);

        let skillsCondition = 'is not null';
        if (noSkills) {
            skillsCondition = 'is null';
        }

        let match = `match (n:${label})-[:${officeRelL}]->(o) where not(n.disabled) and ({officeIds} is null or id(o) in {officeIds})
                     optional match (n)-[k:${kRelL}]->(s:${skillL})-[:${groupLbl}]->(sg) where sg.type in ["tool", "skill"]
                     with n, o, k, s where (s ${skillsCondition})
                     `;

        let countCmd = `${match} return count(distinct n) as count`;

        let cmd = `${match}
                    with n, o, filter(x IN collect(distinct {id: id(s), name: s.name, level: k.level, approved: k.approved, want: k.want}) where x.id is not null) as skills
                    order by n.fullname asc
                    skip {skip} limit {limit}
                    return {
                        id: id(n),
                        username: n.username,
                        fullname: n.fullname,
                        type: n.type,
                        email: n.email,
                        skillsCount: size(skills),
                        unconfirmedSkillsCount:size(skills)-size(filter(s IN skills WHERE s.approved)),
                        office: {id: id(o), name: o.name, country: o.country, acronym: o.acronym}
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
