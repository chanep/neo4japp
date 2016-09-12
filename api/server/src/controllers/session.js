'use strict'
const P = require('bluebird');
const config = require('../shared/config');
const errors = require('../shared/errors');
const BaseController = require('./base-controller');
const authenticationService = new (require('../services/authentication'));

class SessionController extends BaseController{

    /**
    @api {post} /api/session Login
    @apiGroup Session

    @apiParam {string} username
    @apiParam {string} password 

    @apiSuccessExample {json} Success-Response:
    HTTP/1.1 200 OK
    {
        status: "success",
        data: {
            id: 9581,
            sourceId: "5679ae8dd7c7c2aaf75abcf5",
            phonelistId: 45553,
            username: "estebanc",
            type: "UserEmployee",
            email: "esteban.canepa@rga.com",
            fullname: "Esteban Canepa",
            first: "Esteban",
            last: "Canepa",
            phone: "+541159841520",
            image: "https://resized.space.rga.com/image/upload/c_fill,fl_progressive,q_60,h_320,w_320/v1454100932/production/file-56abcd1fafd9087567918feb.jpg",
            roles: ["admin"]
        }
    }
    */
    login(req, res, next){
        let username = req.body.username;
        let password = req.body.password;

        let promise = authenticationService.authenticate(username, password)
            .then(user => {
                req.session.user = user;
                return user;
            });

        this._respondPromise(req, res, promise);
    }

    /**
    @api {delete} /api/session Logout
    @apiGroup Session
    */
    logout(req, res, next){
        let promise = new P((resolve, reject) => {
            req.session.destroy(err =>{
                if(err){
                    reject(new errors.GenericError('Error in logout', err))
                } else{
                    resolve("Logged out")
                }
            })
        })

        this._respondPromise(req, res, promise);
    }

    /**
    @api {get} /api/session/check Check
    @apiDescription Check if user is logged in
    @apiGroup Session

    @apiSuccessExample {json} Success-Response:
    HTTP/1.1 200 OK
    {
        status: "success",
        data: true
    }
    */
    check(req, res, next){
        let logged = req.session && req.session.user;

        this._respondPromise(req, res, P.resolve(logged));
    }

} 

module.exports = SessionController;