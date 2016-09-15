'use strict'
const P = require('bluebird');
const config = require('../shared/config');
const errors = require('../shared/errors');
const BaseController = require('./base-controller');
const userDa = new (require('../data-access/user'));

class UserController extends BaseController{

    /**
    @api {put} /api/user/knowledge Set Knowledge
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

        let promise = userDa.setKnowledge(userId, skillId, level, want);

        this._respondPromise(req, res, promise);
    }

    /**
    @api {put} /api/user/interest Add Interest
    @apiDescription User add an interest for himself
    @apiGroup Users

    @apiParam {String} interestName 
    
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

        let promise = userDa.addInterest(userId, interestName);

        this._respondPromise(req, res, promise);
    }

    /**
    @api {delete} /api/user/interest Remove Interest
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

        let promise = userDa.removeInterest(userId, interestId);

        this._respondPromiseDelete(req, res, promise);
    }


    /**
    @api {get} /api/user/details Details
    @apiDescription Return logged user full data (include knowledges)
    @apiGroup Users
    
    @apiUse userDetailsResponse
    */
    details(req, res, next){
        let userId = req.session.user.id;

        let promise = userDa.findByIdFull(userId);

        this._respondPromise(req, res, promise);
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
        type: "UserEmployee",  
        position: { id: 4835, name: "Developer" }, 
        office: { id: 4832, name: "Buenos Aires", country: "Argentina", acronym: "BA" }, 
        department: { id: 4834, name: "Technology" }, 
        approvers: [{id: 4345, fullname: "Juan Manager"}],
        clients: [{ id: 134, name: "Nike", short: "NIKE" }], 
        interests: [{ id: 298, name: "Chess"}], 
        skillGroups: [{ 
            id: 4844, 
            name: "languages", 
            type: "tool", 
            parent: { id: 4841, name: "Technology", type: "tool" }, 
            skills: [{ 
                id: 4850, 
                name: "Php", 
                knowledge: { id: 18753, level: 3, want: false } 
            }]
        }]
    }, {
       ... 
    }]
}
*/