'use strict'
const P = require('bluebird');
const config = require('../shared/config');
const errors = require('../shared/errors');
const BaseController = require('./base-controller');
const userDa = new (require('../data-access/user'));
const skillDa = new (require('../data-access/skill'));

class SearchAllController extends BaseController{

    /**
    @api {get} /api/resource-manager/search-all Search all
    @apiDescription Search skills, tools and users (people)
    @apiGroup Resource Managers 

    @apiUse searchAllParams
    
    @apiUse searchAllResponse
    */

    /**
    @api {get} /api/approver/search-all Search all
    @apiDescription Search skills, tools and users (people)
    @apiGroup Approvers

    @apiUse searchAllParams
    
    @apiUse searchAllResponse
    */

    searchAll(req, res, next){
        let userId = req.session.user.id;

        let search = this._buildSearch(req);
        let term = search.term;
        let limit = search.limit || 3;
        
        let skills, tools, users;

        let promise = skillDa.findByTerm(term, "skill", limit)
            .then(data => {
                skills = data.data;
                return skillDa.findByTerm(term, "tool", limit);
            })
            .then(data => {
                tools = data.data;
                let userQuery = {fullname: {$ilike: `%${term}%`}, paged: {skip:0, limit: limit}};
                return userDa.find(userQuery);
            })
            .then(data => {
                users = data.data;
                return {skills: skills, tools: tools, users: users};
            })

        this._respondPromise(req, res, promise);
    }

} 

module.exports = SearchAllController;

/**
@apiDefine searchAllParams

@apiParam (Filter) {string} term Searches term in skill/tool name and User fullname
@apiParam (Filter) {number} [limit] Limits then number or results. Default is 3 (means 3 skills, 3 tools and 3 people)
*/

/**
@apiDefine searchAllResponse

@apiSuccessExample {json} Success-Response:
HTTP/1.1 200 OK
{
    status: "success",
    data: { 
        skills: [{id: 123, name: "Data Science"}, {id: 124, name: "Pitching"}], 
        tools: [{id: 1231, name: "Angular"}, {id: 1241, name: "Angular 2"}],
        users: [
            {id: 321: fullname: "Andres Perez", ...},
            {id: 322: fullname: "Andres Lopez", ...}
        ]
    }
}
*/