'use strict'
const P = require('bluebird');
const config = require('../shared/config');
const errors = require('../shared/errors');
const BaseController = require('./base-controller');
const roles = require('../models/roles');
const userDa = new (require('../data-access/user'));
const approverDa = new (require('../data-access/approver'));
const rManagerDa = new (require('../data-access/resource-manager'));
const messagingService = require('../services/messaging');

class UserController extends BaseController{

    /**
    @api {get} /api/user/details 01 Details
    @apiDescription Return logged user full data (include knowledges)
    @apiGroup Users

    @apiUse userDetailsResponse
    */

    /**
    @api {get} /api/user/:userId/details 02 Details by id
    @apiDescription Return user full data (include knowledges)
    @apiGroup Users

    @apiUse userDetailsResponse
    */
    details(req, res, next){
        let loggedUser = req.session.user;
        let userId = Number(req.params.userId || loggedUser.id);
        let promise = this._validateUserAccess(loggedUser, userId)
            .then(() => {
                return userDa.findByIdFull(userId);
            })

        this._respondPromise(req, res, promise);
    }

    /**
    @api {get} /api/user/:userId/skills 03 Skills
    @apiDescription Return the full skillgroup/skill tree. Skill is attached with the corresponding user knwoledge
    @apiGroup Users

    @apiParam (Filter) {boolean} [all] if true returns the full skill tree (even skills user doesn't have kinowledge in)

    @apiSuccessExample {json} Success-Response:
    HTTP/1.1 200 OK
    {
        status: "success",
        data: [{
            id: 11,
            name: "Technology",
            type: "tool"
            children: [{
                id: 12,
                name: "Languages",
                type: "tool",
                skills: [{
                    id: 15,
                    name: 'Php',
                    knowledge: null
                },
                {
                    id: 15,
                    name: 'C++',
                    knowledge: {id: 345, level: 3, want: false, approved: true, approverId: 2345, approverFullname: "Juan Manager"}
                }]
        }, {...}]
    }
    */
    findUserSkills(req, res, next){
        let loggedUser = req.session.user;
        let userId = Number(req.params.userId);
        let search = this._buildSearch(req);
        let allSkills = search.all;
        let promise = this._validateUserAccess(loggedUser, userId)
            .then(() => {
                return userDa.findUserSkills(userId, allSkills);
            });

        this._respondPromise(req, res, promise);
    }

    /**
    @api {get} /api/user/:userId/similar-skilled-users 04 Similar Users
    @apiDescription Return users with similar skills
    @apiGroup Users

    @apiParam (Filter) {number} limit Limits the result user count


    @apiUse similarSkilledUserResponse
    */
    findUsersWithSimilarSkills(req, res, next){
        let userId = Number(req.params.userId);
        let search = this._buildSearch(req);
        let limit = search.limit;

        let promise = userDa.findUsersWithSimilarSkills(userId, limit);

        this._respondPromise(req, res, promise);
    }

    /**
    @api {get} /api/user/level 05 Employee levels
    @apiDescription Return all employee levels
    @apiGroup Users

    @apiSuccessExample {json} Success-Response:
    HTTP/1.1 200 OK
    {
        status: "success",
        data: ["Junior", "Mid-Level", "Senior", "Excecutive"]
    }
    */
    findAllEmployeeLevels(req, res, next){
        let promise = userDa.findAllEmployeeLevels();

        this._respondPromise(req, res, promise);
    }


    /**
    @api {put} /api/user/knowledge 06 Set Knowledge
    @apiDescription User sets his knowledge level in one skill
    @apiGroup Users

    @apiParam {number} skillId
    @apiParam {number} level 1: Heavy Supervision, 2: Light Sup., 3: No Sup., 4: Teach/Manage, null: if user wants to learn
    @apiParam {boolean} want true if user want to learn this skill (in this case the level has no sense)

    @apiSuccessExample {json} Success-Response:
    HTTP/1.1 200 OK
    {
        status: "success",
        data: {
            id: 11,
            level: 3,
            want: false
        }
    }
    */
    setKnowledge(req, res, next){
        let userId = req.session.user.id;
        let skillId = req.body.skillId;
        let level = req.body.level;
        let want = req.body.want;

        let promise = userDa.setKnowledge(userId, skillId, level, want)
                        .then(result => {
                            this._updateUserLastSkillUpdate(userId);
                            return result;
                        });

        this._respondPromise(req, res, promise);
    }

    /**
    @api {delete} /api/user/knowledge 07 Delete Knowledge
    @apiDescription User deletes his knowledge in one skill
    @apiGroup Users

    @apiParam {number} skillId

    @apiSuccessExample {json} Success-Response:
    HTTP/1.1 200 OK
    {
        status: "success",
        affected: 1
    }
    */
    deleteKnowledge(req, res, next){
        let userId = req.session.user.id;
        let skillId = req.body.skillId;

        let promise = userDa.deleteKnowledge(userId, skillId)
                        .then(result => {
                            this._updateUserLastUpdate(userId);
                            return result;
                        });

        this._respondPromiseDelete(req, res, promise);
    }

    /**
    @api {put} /api/user/interest 08 Add Interest
    @apiDescription User add an interest for himself
    @apiGroup Users

    @apiParam {string} interestName

    @apiSuccessExample {json} Success-Response:
    HTTP/1.1 200 OK
    {
        status: "success",
        data: {
            id: 11,
            name: "Football"
        }
    }
    */
    addInterest(req, res, next){
        let userId = req.session.user.id;
        let interestName = req.body.interestName;

        let promise = userDa.addInterest(userId, interestName)
                        .then(result => {
                            this._updateUserLastUpdate(userId);
                            return result;
                        });

        this._respondPromise(req, res, promise);
    }

    /**
    @api {delete} /api/user/interest 09 Remove Interest
    @apiDescription User removes one of his interests
    @apiGroup Users

    @apiParam {number} interestId

    @apiSuccessExample {json} Success-Response:
    HTTP/1.1 200 OK
    {
        status: "success",
        affected: 1
    }
    */
    removeInterest(req, res, next){
        let userId = req.session.user.id;
        let interestId = req.body.interestId;

        let promise = userDa.removeInterest(userId, interestId)
                        .then(result => {
                            this._updateUserLastUpdate(userId);
                            return result;
                        });

        this._respondPromiseDelete(req, res, promise);
    }

    /**
    @api {put} /api/user/client 10 Add Client
    @apiDescription User add a previous client he worked for
    @apiGroup Users

    @apiParam {string} clientName

    @apiSuccessExample {json} Success-Response:
    HTTP/1.1 200 OK
    {
        status: "success",
        data: {
            id: 1134,
            name: "CompuMundoHiperMegaRed"
        }
    }
    */
    addClient(req, res, next){
        let userId = req.session.user.id;
        let clientName = req.body.clientName;

        let promise = userDa.addClientByClientName(userId, clientName)
                        .then(result => {
                            this._updateUserLastUpdate(userId);
                            return result;
                        });

        this._respondPromise(req, res, promise);
    }

    /**
    @api {delete} /api/user/client 11 Remove Client
    @apiDescription User removes one of his previous client
    @apiGroup Users

    @apiParam {number} clientId

    @apiSuccessExample {json} Success-Response:
    HTTP/1.1 200 OK
    {
        status: "success",
        affected: 1
    }
    */
    removeClient(req, res, next){
        let userId = req.session.user.id;
        let clientId = req.body.clientId;

        let promise = userDa.removeClient(userId, clientId)
                        .then(result => {
                            this._updateUserLastUpdate(userId);
                            return result;
                        });

        this._respondPromiseDelete(req, res, promise);
    }

    /**
    @api {put} /api/user/skill-suggestion 12 Suggest skill
    @apiDescription Send an email to Skillsearch admin to suggest a skill addition
    @apiGroup Users

    @apiParam {string} skillName
    @apiParam {string} skillType skill, tool or industry
    @apiParam {string} description

    @apiSuccessExample {json} Success-Response:
    HTTP/1.1 200 OK
    {
        status: "success",
        data: "email sent"
    }
    */
    suggestSkill(req, res, next){
        const user = req.session.user;
        const skillName = req.body.skillName;
        const skillType = req.body.skillType;
        const description = req.body.description;

        let promise = messagingService.sendSkillSuggestionEmail(user, skillName, skillType, description)
            .then(() => {
                return "email sent";
            });

        this._respondPromise(req, res, promise);
    }

    /**
    @api {get} /api/external-service/user-summary 1 Find user summaries
    @apiDescription List users with skills, industries and allocation
    @apiGroup External Services

    @apiParam (Filter) {number} [skip] Skips n Users (for paged result)
    @apiParam (Filter) {number} [limit] Limits then number or results. Default is 100  (for paged result)
    @apiParam (HTTP Headers) {string} X-Access-Key Access key for this resource

    @apiSuccessExample {json} Success-Response:
    HTTP/1.1 200 OK
    {
        status: "success",
        paged: {skip:0 , limit:100, totalCount: 200}
        data: [{
            fullname: "Pepe Test4",
            email: "pepe.test4@rga.com",
            username: "pepetest4",
            approvers: [{email: "boss@rga.com"}],
            resourceManagers: [{email: "res.man@rga.com"}],
            allocation: {
                id: 6519,
                totalHours:120,
                weekHours:[30,30,30,30],
                workingWeekHours:[40,40,40,40],
                startDate: ["09-05-2016","09-12-2016","09-19-2016","09-26-2016"]},
            skills: [
                { name: "C++", type: "tool", subGroup: "Languages", group: "Technology", level: 3, want: false, approved: true },
                {...}
            ],
            industries: ["Financial"],
            clients: ["Nike", "Patagonia"]
        }, {
        ...
        }]
    }
    */

    findUserSummary(req, res, next){
        let search = this._buildSearch(req);
        let skip = search.skip || 0;
        let limit = Math.min(100, search.limit || 100);
        

        let promise = userDa.findUserSummary(skip, limit);

        this._respondPromise(req, res, promise);
    }



    _validateUserAccess(loggedUser, userId){
        if(loggedUser.id == userId || roles.hasRole(loggedUser.roles, roles.resourceManager) || roles.hasRole(loggedUser.roles, roles.searcher))
            return P.resolve();
        return approverDa.isApproverOf(loggedUser.id, userId)
            .then(isApproverOf => {
                if(isApproverOf)
                    return true;
                throw new errors.ForbiddenError("You don't have access to this user details")
            });
    }
    _updateUserLastSkillUpdate(userId){
        let user = {
            id: userId,
            lastSkillUpdate: Date.now(),
            lastUpdate: Date.now()
        };
        return userDa.update(user, true);
    }

    _updateUserLastUpdate(userId){
        let user = {
            id: userId,
            lastUpdate: Date.now()
        };
        return userDa.update(user, true);
    }
}

module.exports = UserController;

/**
@apiDefine userDetailsResponse

@apiSuccessExample {json} Success-Response:
HTTP/1.1 200 OK
{
    status: "success",
    data: [{
        id: 4839,
        fullname: "Pepe Test4",
        roles: [],
        email: "pepe.test4@rga.com",
        username: "pepetest4",
        image: "http://x.com/pic.jpg",
        phone: null,
        disabled: false,
        lastUpdate: "2016-10-24T17:21:22.633Z",
        type: "UserEmployee",
        skillCount: 5,
        unapprovedSkillCount: 3,
        position: { id: 4835, name: "Developer" },
        office: { id: 4832, name: "Buenos Aires", country: "Argentina", acronym: "BA" },
        department: { id: 4834, name: "Technology" },
        approvers: [{
            id: 4345,
            fullname: "Juan Manager",
            department: { id: 4834, name: "Technology" },
            position: { id: 4835, name: "Developer" },
        }],
        resourceManagers: [{
            id: 4346,
            fullname: "Agostina Gomez",
            department: { id: 4846, name: "Resource Management" },
            position: { id: 4897, name: "Associate Resource Manager" },
        }],
        allocation: {
            id: 6519,
            totalHours:120,
            weekHours:[30,30,30,30],
            workingWeekHours:[40,40,40,40],
            startDate: ["09-05-2016","09-12-2016","09-19-2016","09-26-2016"]},
        clients: [{ id: 134, name: "Nike", phonelistId: 23463 }],
        interests: [{ id: 298, name: "Chess"}],
        industries: [{ id: 346, name: "Financial"}]
    }, {
       ...
    }]
}
*/

/**
@apiDefine similarSkilledUserResponse

@apiSuccessExample {json} Success-Response:
HTTP/1.1 200 OK
{
    status: "success",
    data: [{
        id: 4839,
        fullname: "Pepe Test4",
        email: "pepe.test4@rga.com",
        username: "pepetest4",
        image: "http://x.com/pic.jpg",
        position: { id: 4835, name: "Developer" },
        office: { id: 4832, name: "Buenos Aires", country: "Argentina", acronym: "BA" },
        department: { id: 4834, name: "Technology" },
        similitudeScore: 38
    }, {
       ...
    }]
}
*/
