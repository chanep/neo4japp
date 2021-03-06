'use strict'
const P = require('bluebird');
const _ = require('lodash');
const config = require('../shared/config');
const errors = require('../shared/errors');
const BaseController = require('./base-controller');
const resourceManagerDa = new (require('../data-access/resource-manager'));
const skillDa = new (require('../data-access/skill'));
const postal = require('postal');
const messaging = require('../services/messaging');

const skillChannel = postal.channel('skill');

class ResourceManagerController extends BaseController{

    /**
    @api {get} /api/resource-manager/:resourceManagerId/my-resources 2 Approver's team
    @apiDescription List the resources of the given resource manager (sorted by pending approval skills count descending).
        The resource manager must be in the chain of command of the logged user
    @apiGroup Resource Managers

    @apiParam (Filter) {boolean} onlyPendingApprove List users with pending approval skills only
    @apiParam (Filter) {boolean} includeWantSkills Include also skills that user would like to learn

    @apiUse teamResponse
    */
    findMyResourceUsers(req, res, next){
        let loggedUserId = req.session.user.id;
        let resourceManagerId = Number(req.params.resourceManager || loggedUserId);

        let search = this._buildSearch(req);
        let onlyPendingApproval = search.onlyPendingApproval;
        let includeWantSkills = search.includeWantSkills;

        let promise = this._validateUserAccess(loggedUserId, resourceManagerId)
            .then(() => {
                return resourceManagerDa.findMyResourceUsers(resourceManagerId, onlyPendingApproval, includeWantSkills);
            });

        this._respondPromise(req, res, promise);
    }

    allResourceManagers(req, res, next){
        let promise = resourceManagerDa.allResourceManagers();

        this._respondPromise(req, res, promise);
    }

    /**
    @api {get} /api/resource-manager/skill-by-user 1 Find users with skills by office or deparment
    @apiDescription List amount of skills by users (sorted by fullname)
    @apiGroup Resource Managers

    @apiParam (Filter) {Array} [offices] Array with office ids
    @apiParam (Filter) {bool}  [noSkills] Filters users without skills
    @apiParam (Filter) {number} [skip] Skips n Users (for paged result)
    @apiParam (Filter) {number} [limit] Limits then number or results. Default is 20  (for paged result)
    @apiParam (Filter) {String="relevance", "matchedItems", "allocation", "fullname_asc", "fullname_desc", "office_asc", "office_desc"} [orderBy] Orders result

    @apiUse usersResponse
    */
    findSkillByUser(req, res, next){
        let search = this._buildSearch(req);
        let officeIds = search.offices || [];
        let noSkills = search.noSkills || false;
        let skip = search.skip || 0;
        let limit = search.limit || 20;
        let filters = _.omit(search, ['skills', 'offices', 'noSkills', 'skip', 'limit']);

        let promise = resourceManagerDa.findSkillByUsers(officeIds, noSkills, filters, skip, limit, search.orderBy);

        this._respondPromise(req, res, promise);
    }

    /**
    @api {get} /api/resource-manager/users-by-skill 3 Find users by skill
    @apiDescription List users who have at least one of the searched skills (sorted by skill match count and skill level, descending)
    @apiGroup Resource Managers

    @apiParam (Filter) {Array} skills Array with skill ids (tools, skills and industries)
    @apiParam (Filter) {Array} [levels] Array with employee levels
    @apiParam (Filter) {Array} [interests] Array with interests ids
    @apiParam (Filter) {Array} [clients] Array with clients ids
    @apiParam (Filter) {Array} [offices] Array with office ids
    @apiParam (Filter) {number} [skip] Skips n Users (for paged result)
    @apiParam (Filter) {number} [limit] Limits then number or results. Default is 20  (for paged result)
    @apiParam (Filter) {String="relevance", "matchedItems", "allocation", "fullname_asc", "fullname_desc", "office_asc", "office_desc"} [orderBy] Orders result

    @apiUse usersResponse
    */
    findUsersBySkill(req, res, next){
        let search = this._buildSearch(req);
        let skillIds = search.skills || [];
        let skip = search.skip || 0;
        let limit = search.limit || 20;
        let filters = _.omit(search, ['skills', 'skip', 'limit']);

        let searchData = {
            userId: req.session.user.id,
            skillIds: skillIds
        };
        skillChannel.publish("searched", searchData);

        let promise = resourceManagerDa.findUsersBySkill(skillIds, filters, skip, limit, search.orderBy);

        this._respondPromise(req, res, promise);
    }

    /**
    @api {get} /api/resource-manager/top-skill-searches 4 Top Skills
    @apiDescription List most searched skills
    @apiGroup Resource Managers

    @apiParam (Filter) {number} [limit] limit the skill count
    @apiParam (Filter) {number} [fromDate] (in milliseconds from Unix epoch datetime)
    @apiParam (Filter) {number} [toDate] (in milliseconds from Unix epoch datetime)

    @apiSuccessExample {json} Success-Response:
    HTTP/1.1 200 OK
    {
        status: "success",
        data: [{
            id: 260,
            name: "Php",
            searches: 38,
            group: {
                id: 261,
                name: "Languages",
                type: "tool"
                parent: {
                    id: 262,
                    name: "Technology",
                    type: "tool"
            },{
            id: 261,
            name: "Javascript",
            searches: 35,
            group: {
                id: 261,
                name: "Languages",
                type: "tool"
                parent: {
                    id: 262,
                    name: "Technology",
                    type: "tool"
            }
        }, {...}]
    }
    */


    topSkillSearches(req, res, next){
        let search = this._buildSearch(req);

        let promise = resourceManagerDa.topSkillSearches(search.limit, search.fromDate, search.toDate);

        this._respondPromise(req, res, promise);
    }

    /**
    @api {get} /api/resource-manager/skilled-users-by-office/:skillId 5 Skilled users by office
    @apiDescription List offices with the number of users who knows the given skill
    @apiGroup Resource Managers

    @apiParam {number} skillId

    @apiSuccessExample {json} Success-Response:
    HTTP/1.1 200 OK
    {
        status: "success",
        data: [{
            id: 260,
            name: "Buenos Aires",
            description: "Buenos Aires",
            sourceId: "5679ad1fd7c7c2aaf75ab508",
            zip: "C1414DAP",
            country: "Argentina",
            address: "Uriarte 1572",
            acronym: "BA",
            phone: "+54 11 5984 0500",
            longitude: -58.43251
            latitude: -34.587572,
            uri: "buenos-aires",
            skilledUserCount: 14
        }, {...}]
    }
    */
    skilledUsersByOffice(req, res, next){
        let skillId = Number(req.params.skillId);

        let promise = resourceManagerDa.skilledUsersByOffice(skillId);

        this._respondPromise(req, res, promise);
    }

    /**
    @api {put} /api/resource-manager/approval-request/:employeeId 6 Request Approval
    @apiDescription Send an email to the approver requesting an employee's skill approval
    @apiGroup Resource Managers

    @apiParam {number} employeeId

    @apiSuccessExample {json} Success-Response:
    HTTP/1.1 200 OK
    {
        status: "success",
        data: "Email sent"
    }
    */
    requestApproval(req, res, next){
        const userId = req.session.user.id;
        const employeeId = Number(req.params.employeeId);

        let promise = messaging.sendApprovalRequestEmail(req.session.user, employeeId)
            .then(() => "Email sent");

        this._respondPromise(req, res, promise);
    }

    _validateUserAccess(loggedUserId, resourceManagerId){
        if(loggedUserId == resourceManagerId)
            return P.resolve();
        const deep = true;
        return resourceManagerDa.isResourceManagerOf(loggedUserId, resourceManagerId, deep)
            .then(isResourceManagerOf => {
                if(isResourceManagerOf)
                    return true;
                throw new errors.ForbiddenError("You don't have access to this approver's team")
            });
    }
}

module.exports = ResourceManagerController;


/**
@apiDefine usersResponse

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
        lastLogin: "2016-10-24T17:21:22.633Z",
        lastUpdate: "2016-10-24T17:21:22.633Z",
        position: { id: 4835, name: "Developer" },
        office: { id: 4832, name: "Buenos Aires", country: "Argentina", acronym: "BA" },
        approvers: [{id: 4345, fullname: "Juan Manager"}],
        allocation: {
            id: 6519,
            totalHours:120,
            weekHours:[30,30,30,30],
            workingWeekHours:[40,40,40,40],
            startDate: ["09-05-2016","09-12-2016","09-19-2016","09-26-2016"]},
        matchedItems: 3,
        searchedItems: 4,
        score: 15,
        skills: [{
            id: 4844,
            name: "Angular",
            level: 4,
            approved: true,
            want: false
        },{
            id: 4844,
            name: "Php",
            level: 3,
            approved: false,
            want: false}]
        industries: [],
        interests: [{id: 4354, name "Football"}],
        clients: [{id: 2354, name "Manaos"}]
    }, {
       ...
    }]
}
*/
