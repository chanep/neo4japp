'use strict'
const P = require('bluebird');
const config = require('../shared/config');
const errors = require('../shared/errors');
const BaseController = require('./base-controller');
const resourceManagerDa = new (require('../data-access/resource-manager'));
const skillDa = new (require('../data-access/skill'));
const postal = require('postal');

const skillChannel = postal.channel('skill');

class ResourceManagerController extends BaseController{
    /**
    @api {get} /api/resource-manager/users-by-skill Find users by skill
    @apiDescription List users who have at least one of the searched skills (sorted by skill match count and skill level, descending)
    @apiGroup Resource Managers

    @apiParam (Filter) {Array} skills Array with skill ids
    @apiParam (Filter) {Array} [offices] Array with office ids
    @apiParam (Filter) {number} [skip] Skips n Users (for paged result)
    @apiParam (Filter) {number} [limit] Limits then number or results. Default is 20  (for paged result)
    
    @apiUse usersResponse
    */
    findUsersBySkill(req, res, next){
        let search = this._buildSearch(req);

        let skillIds = search.skills;

        let searchData = {
            userId: req.session.user.id,
            skillIds: skillIds
        };
        skillChannel.publish("searched", searchData);

        let filters = {};
        filters.offices = search.offices;
        
        let skip = search.skip || 0;
        let limit = search.limit || 20;

        let promise = resourceManagerDa.findUsersBySkill(skillIds, filters, skip, limit);

        this._respondPromise(req, res, promise);   
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
        position: { id: 4835, name: "Developer" }, 
        office: { id: 4832, name: "Buenos Aires", country: "Argentina", acronym: "BA" }, 
        approvers: [{id: 4345, fullname: "Juan Manager"}],
        allocation: {id: 6519 totalHours:120, weekHours:30,30,30,30, startDate:09-05-2016,09-12-2016,09-19-2016,09-26-2016},
        score: 15,
        skills: [{ 
            id: 4844, 
            name: "Angular", 
            level: 4,
            approved: true
        },{ 
            id: 4844, 
            name: "Php", 
            level: 3,
            approved: false}]
    }, {
       ... 
    }]
}
*/