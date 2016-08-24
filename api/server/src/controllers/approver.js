'use strict'
const P = require('bluebird');
const config = require('../shared/config');
const errors = require('../shared/errors');
const BaseController = require('./base-controller');
const approverDa = new (require('../data-access/approver'));

class ApproverController extends BaseController{

    /**
    @api {get} /api/approver/my-team Team
    @apiDescription List the logged user's team users (sorted by pending skills)
    @apiGroup Users

    @apiParam (Filter) {boolean} onlyPendingApprove List users with pending approval skills only
    @apiParam (Filter) {boolean} includeWantSkills Include also skills that user would like to learn
    
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
    findMyTeamUsers(req, res, next){
        let userId = req.session.user.id;
        let onlyPendingApprove = req.body.onlyPendingApprove;
        let includeWantSkills = req.body.includeWantSkills;

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

/*
@apiUse teamResponse
@apiSuccessExample {json} Success-Response:
HTTP/1.1 200 OK
{
    status: "success",
    data: {[

    ]
    }
}
*/