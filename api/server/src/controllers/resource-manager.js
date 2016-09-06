'use strict'
const P = require('bluebird');
const config = require('../shared/config');
const errors = require('../shared/errors');
const BaseController = require('./base-controller');
const userDa = new (require('../data-access/user'));
const skillDa = new (require('../data-access/skill'));

class ResourceManagerController extends BaseController{

    /**
    @api {get} /api/resource-manager/search-all Search all
    @apiDescription Search skills, tools and users (people)
    @apiGroup Resource Managers

    @apiParam (Filter) {string} term Searches term in skill/tool name and User fullname
    @apiParam (Filter) {number} [limit] Limits then number or results. Default is 3 (means 3 skills, 3 tools and 3 people)
    
    */
    searchAll(req, res, next){
        let userId = req.session.user.id;

        let search = this._buildSearch(req);
        let term = search.term;
        let limit = search.limit || 3;

        let promise = P.resolve("x");

        this._respondPromise(req, res, promise);
    }

} 

module.exports = ResourceManagerController;