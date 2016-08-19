'use strict'
const config = require('../shared/config');
const errors = require('../shared/errors');
const BaseController = require('./base-controller');
const authenticationService = new (require('../services/authentication'));

class SessionController extends BaseController{
    login(req, res, next){
        let promise = loginService.authenticate()
    }

} 