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
        
        let search = this._buildSearch(req);
        let onlyPendingApproval = search.onlyPendingApproval;
        let includeWantSkills = search.includeWantSkills;

        let promise = approverDa.findMyTeamUsers(userId, onlyPendingApproval, includeWantSkills);

        this._respondPromise(req, res, promise);
    }


} 

module.exports = ApproverController;

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