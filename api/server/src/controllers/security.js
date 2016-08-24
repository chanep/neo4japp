'use strict'
const _ = require('lodash');
const P = require('bluebird');
const config = require('../shared/config');
const errors = require('../shared/errors');
const BaseController = require('./base-controller');
const authenticationService = new (require('../services/authentication'));

class SecurityController extends BaseController{
    checkLoggedIn(req, res, next) {
        if (!req.session || !req.session.user) {
            let err = new errors.ForbiddenError('User must be logged in');
            this._handleError(res, err);
        } else {
            next()
        }
    }
    checkRole(roles){
        return (req, res, next) => {
            if(typeof roles === 'string'){
                roles = [roles];
            }
            let matches = _.intersection(req.session.user.roles, roles);
            if(matches.length == 0){
                let err = new errors.ForbiddenError('User must be member of ' + roles.join(' or '));
                this._handleError(res, err);
            } else{
                next()
            }
        }
    }

} 

module.exports = SecurityController;