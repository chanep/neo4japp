'use strict'
const P = require('bluebird');
const config = require('../shared/config');
const errors = require('../shared/errors');
const BaseController = require('./base-controller');
const skillDa = new (require('../data-access/skill'));
const skillgroupDa = new (require('../data-access/skill-group'));

class SkillController extends BaseController{

    /**
    @api {get} /api/skill Find skills
    @apiGroup Skills

    @apiParam (Filters) {string} [name] Skill name (find skills containing name parameter case insensitive) 
    @apiParam (Filters) {string} [type] Skillgroup type (find skills of certain group type) 
    @apiParam (Filters) {number} [limit] Limits the result 

    @apiExample {curl} Example usage:
        /api/skill?name=hp&type=tool&limit=20
    
    @apiUse findSkillResponse
    */
    find(req, res, next){
        let query = {
            includes: [
                {key: "group", includes: ["parent"]}
            ],
            paged: {limit: 10, skip: 0},
            orderBy: "name ASC"
        };

        let search = this._buildSearch(req);

        let name = search.name;
        let type = search.type;
        let limit = search.limit;

        if(name)
            query.name= {$ilike:'%' + name + '%'};
        if(type)
            query.includes[0].query.type = type;
        if(limit)
            query.paged.limit = limit;

        let promise = skillDa.find(query);

        this._respondPromise(req, res, promise);
    }

    /**
    @api {get} /api/skill/all-groups Find all groups
    @apiDescription Finds all skill groups hierarchy (includes sub groups and skills)
    @apiGroup Skills
    
    @apiUse findAllGroupsResponse
    */
    findAllGroups(req, res, next){
        let promise = skillgroupDa.findAll();

        this._respondPromise(req, res, promise);
    }

} 

module.exports = SkillController;


    /**
    @apiDefine findSkillResponse
        @apiSuccessExample {json} Success-Response:
          HTTP/1.1 200 OK
          {
            status: "success",
            paged: {skip:0 , limit:10, totalCount: 200}
            data: [{
                id: 260,
                name: "Php",
                group: {
                    id: 261,
                    name: "Languages",
                    type: "tool"
                    parent: {
                        id: 262,
                        name: "Technology",
                        type: "tool"
                    }
                }
            }, {...}]
          }
    */

    /**
    @apiDefine findAllGroupsResponse
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
                        name: 'Php'  
                    }]
            }, {...}]
          }
    */