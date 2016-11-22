'use strict'
const P = require('bluebird');
const config = require('../shared/config');
const errors = require('../shared/errors');
const BaseController = require('./base-controller');
const userDa = new (require('../data-access/user'));
const skillDa = new (require('../data-access/skill'));
const interestDa = new(require('../data-access/interest'));

class SearchAllController extends BaseController{

    /**
    @api {get} /api/resource-manager/search-all 2 Search all
    @apiDescription Search skills, tools and users (people)
    @apiGroup Resource Managers 

    @apiUse searchAllParams
    
    @apiUse searchAllResponse
    */

    /**
    @api {get} /api/approver/search-all 2 Search all
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
        
        let skills, tools, industries, interests, users;

        if(term){
            term = term.replace('.', '\\.').replace('*', '\\*').replace('^', '\\^');
        }
        

        let promise = skillDa.findByTerm(term, "skill", limit)
            .then(data => {
                skills = data.data;
                return skillDa.findByTerm(term, "tool", limit);
            })
            .then(data => {
                tools = data.data;
                return skillDa.findByTerm(term, "industry", limit);
            })
            .then(data => {
                industries = data.data;
                let userQuery = {fullname: {$ilike: `%${term}%`}, disabled: false, paged: {skip:0, limit: limit}};
                return userDa.find(userQuery);
            })
            .then(data => {
                users = data.data;
                return interestDa.findByTerm(term, limit);
            })
            .then(data => {
                interests = data.data;
                return {
                    skills: skills, 
                    tools: tools, 
                    industries: industries, 
                    interests: interests, 
                    users: users
                };
            })

        this._respondPromise(req, res, promise);
    }

} 

module.exports = SearchAllController;

/**
@apiDefine searchAllParams

@apiParam (Filter) {string} term Searches term in skill/tool/industry/interest name and User fullname
@apiParam (Filter) {number} [limit] Limits then number or results. Default is 3 (means 3 skills, 3 tools, 3 industries, 3 interests and 3 people)
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
        industries: [{id: 1543, name: "Financial"}],
        interests: [{id: 1643, name: "Animals"}],
        users: [
            {id: 321: fullname: "Andres Perez", ...},
            {id: 322: fullname: "Andres Lopez", ...}
        ]
    }
}
*/