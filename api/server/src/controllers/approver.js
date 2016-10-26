'use strict'
const P = require('bluebird');
const config = require('../shared/config');
const errors = require('../shared/errors');
const BaseController = require('./base-controller');
const approverDa = new (require('../data-access/approver'));

class ApproverController extends BaseController{

    /**
    @api {get} /api/approver/my-team 1 Team
    @apiDescription List the logged user's team users (sorted by pending approval skills count descending)
    @apiGroup Approvers

    @apiParam (Filter) {boolean} onlyPendingApprove List users with pending approval skills only
    @apiParam (Filter) {boolean} includeWantSkills Include also skills that user would like to learn
    
    @apiUse teamResponse
    */
    findMyTeamUsers(req, res, next){
        let userId = req.session.user.id;

        let search = this._buildSearch(req);
        let onlyPendingApproval = search.onlyPendingApproval;
        let includeWantSkills = search.includeWantSkills;

        let promise = approverDa.findMyTeamUsers(userId, onlyPendingApproval, includeWantSkills);

        this._respondPromise(req, res, promise);
    }

    /**
    @api {put} /api/approver/approve 3 Approve
    @apiDescription An Approver (manager) approves (verify) a employee's skill knowledge 
    @apiGroup Approvers

    @apiParam {number} knowledgeId List users with pending approval skills only
    @apiParam {boolean} [disapprove] True for clear approval
    
    @apiSuccessExample {json} Success-Response:
    HTTP/1.1 200 OK
    {
        status: "success",
        data: {
            id: 234,
            level: 4,
            want: false,
            approved: true,
            approverId: 456,
            approverFullname: "Juan Perez"
        }
    } 
    */
    approveKnowledge(req, res, next){
        let userId = req.session.user.id;
        let knowledgeId = req.body.knowledgeId;
        let disapprove = req.body.disapprove;


        let promise = approverDa.isApproverOfKnowledge(userId, knowledgeId)
            .then(granted => {
                if(!granted)
                    throw new errors.ForbiddenError(`User ${req.session.user.username} is forbidden to approve knowledgeId ${knowledgeId}`);
                return approverDa.approveKnowledge(userId, knowledgeId, disapprove);
            });

        this._respondPromise(req, res, promise);
    }


} 

module.exports = ApproverController;

/**
@apiDefine teamResponse

@apiSuccessExample {json} Success-Response:
HTTP/1.1 200 OK
{
    status: "success",
    data: [{ 
        "id": 4839, 
        "fullname": "Pepe Test4", 
        "roles": [],
        "email": "pepe.test4@rga.com", 
        "username": "pepetest4", 
        "image": "http://x.com/pic.jpg",
        "phone": null,
        "disabled": false, 
        lastUpdate: "2016-10-24T17:21:22.633Z",
        "type": "UserEmployee", 
        "totalPendingApproval": 1, 
        "position": { "id": 4835, "name": "Developer" }, 
        "office": { "id": 4832, "name": "Buenos Aires", "country": "Argentina", "acronym": "BA" }, 
        "department": { "id": 4834, "name": "Technology" }, 
        "skillGroups": [{ 
            "id": 4844, 
            "name": "languages", 
            "type": "tool", 
            "parent": { "id": 4841, "name": "Technology", "type": "tool" }, 
            "skills": [{ 
                "id": 4850, 
                "name": "Php", 
                "knowledge": { "id": 18753, "level": 3, "want": false } 
            }],
            "pendingApprovalCount": 1 
        }]
    }, {
       ... 
    }]
}
*/