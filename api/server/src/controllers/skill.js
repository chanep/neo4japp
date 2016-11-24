'use strict'
const P = require('bluebird');
const config = require('../shared/config');
const errors = require('../shared/errors');
const BaseController = require('./base-controller');
const skillDa = new (require('../data-access/skill'));
const skillgroupDa = new (require('../data-access/skill-group'));

class SkillController extends BaseController{

    /**
    @api {get} /api/skill 1 Find skills
    @apiGroup Skills

    @apiParam (Filters) {string} [name] Skill name (find skills containing name parameter case insensitive) 
    @apiParam (Filters) {Array} [type] Skillgroup type (find skills of certain group type) 
    @apiParam (Filters) {Array} [ids] Skill id's
    @apiParam (Filters) {number} [limit] Limits the result 

    @apiExample {curl} Example usage:
        /api/skill?name=hp&type[]=tool&limit=20
    
    @apiUse findSkillResponse
    */
    find(req, res, next){
        let query = {
            includes: [
                {key: "group", includes: ["parent"], query: {}}
            ],
            paged: {limit: 10, skip: 0},
            orderBy: "name ASC"
        };

        let search = this._buildSearch(req);

        let name = search.name;
        let type = search.type;
        let ids = search.ids;
        let limit = search.limit;

        if(name)
            query.name= {$ilike:'%' + name + '%'};
        if(type)
            query.includes[0].query.type = {$in: type};
        if(ids)
            query.id = {$in: ids};
        if(limit)
            query.paged.limit = limit;

        let promise = skillDa.find(query);

        this._respondPromise(req, res, promise);
    }

    /**
    @api {get} /api/skill/all-groups 2 Find all groups
    @apiDescription Finds all skill groups hierarchy (includes sub groups and skills)
    @apiGroup Skills
    
    @apiUse findAllGroupsResponse
    */
    findAllGroups(req, res, next){
        let promise = skillgroupDa.findAll();

        this._respondPromise(req, res, promise);
    }

    /**
    @api {get} /api/skill/by-group-type/:type 3 Find by type
    @apiDescription Find all skills of a given group type
    @apiGroup Skills

    @apiExample {curl} Example usage:
        /api/skill/by-group-type/industry
    
    @apiSuccessExample {json} Success-Response:
          HTTP/1.1 200 OK
          {
            status: "success",
            data: [{
                id: 260,
                name: "Financial"
            },
            {
                id: 261,
                name: "Health & Beauty"
            }, {...}]
          }
    */
    findByType(req, res, next){
        let type = req.params.type;
        let promise = skillDa.findByType(type);

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