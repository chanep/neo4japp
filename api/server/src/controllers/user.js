'use strict'
const P = require('bluebird');
const config = require('../shared/config');
const errors = require('../shared/errors');
const BaseController = require('./base-controller');
const roles = require('../models/roles');
const userDa = new (require('../data-access/user'));
const approverDa = new (require('../data-access/approver'));
const rManagerDa = new (require('../data-access/resource-manager'));

class UserController extends BaseController{

    /**
    @api {get} /api/user/details 1 Details
    @apiDescription Return logged user full data (include knowledges)
    @apiGroup Users
    
    @apiUse userDetailsResponse
    */

    /**
    @api {get} /api/user/:userId/details 2 Details by id
    @apiDescription Return user full data (include knowledges)
    @apiGroup Users
    
    @apiUse userDetailsResponse
    */
    details(req, res, next){
        let loggedUser = req.session.user;
        let userId = req.params.userId || loggedUser.id;
        let promise = this._validateUserAccess(loggedUser, userId)
            .then(() => {
                return userDa.findByIdFull(userId);
            })
            
        this._respondPromise(req, res, promise);
    }

    /**
    @api {get} /api/user/skills 3 Skills
    @apiDescription Return the full skillgroup/skill tree. Skill is attached with the corresponding user knwoledge
    @apiGroup Users

    @apiParam (Filter) {boolean} [all] if true returns the full skill tree (even skills user doesn't have kinowledge in)
    
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
                    name: 'Php',
                    knowledge: null
                },
                {
                    id: 15,
                    name: 'C++',
                    knowledge: {id: 345, level: 3, want: false, approved: false}  
                }]
        }, {...}]
    }
    */
    findUserSkills(req, res, next){
        let loggedUser = req.session.user;
        let userId = loggedUser.id;
        let search = this._buildSearch(req);
        let allSkills = search.all;

        let promise = userDa.findUserSkills(userId, allSkills);

        this._respondPromise(req, res, promise);
    }

    /**
    @api {get} /api/user/:userId/similar-skilled-users 4 Similar Users
    @apiDescription Return users with similar skills
    @apiGroup Users

    @apiParam (Filter) {number} limit Limits the result user count

    
    @apiUse similarSkilledUserResponse
    */
    findUsersWithSimilarSkills(req, res, next){
        let userId = req.params.userId;
        let search = this._buildSearch(req);
        let limit = search.limit;

        let promise = userDa.findUsersWithSimilarSkills(userId, limit);
            
        this._respondPromise(req, res, promise);
    }


    /**
    @api {put} /api/user/knowledge 5 Set Knowledge
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
    @api {put} /api/user/interest 6 Add Interest
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
    @api {delete} /api/user/interest 7 Remove Interest
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



    _validateUserAccess(loggedUser, userId){
        if(loggedUser.id == userId || roles.hasRole(loggedUser.roles, roles.resourceManager))
            return P.resolve();
        return approverDa.isApproverOf(loggedUser.id, userId)
            .then(isApproverOf => {
                if(isApproverOf)
                    return true;
                return new errors.ForbiddenError("You don't have access to this user details")
            });
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

/**
@apiDefine similarSkilledUserResponse

@apiSuccessExample {json} Success-Response:
HTTP/1.1 200 OK
{
    status: "success",
    data: [{ 
        id: 4839, 
        fullname: "Pepe Test4", 
        email: "pepe.test4@rga.com", 
        username: "pepetest4", 
        image: "http://x.com/pic.jpg",
        position: { id: 4835, name: "Developer" }, 
        office: { id: 4832, name: "Buenos Aires", country: "Argentina", acronym: "BA" }, 
        department: { id: 4834, name: "Technology" }, 
        similitudeScore: 38
    }, {
       ... 
    }]
}
*/