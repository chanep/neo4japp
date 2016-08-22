'use strict'
const P = require('bluebird');
const config = require('../shared/config');
const errors = require('../shared/errors');
const BaseController = require('./base-controller');
const authenticationService = new (require('../services/authentication'));

class SessionController extends BaseController{
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

} 

module.exports = SessionController;