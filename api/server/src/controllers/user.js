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
