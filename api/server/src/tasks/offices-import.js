'use strict'
const errors = require('../shared/errors');
const P = require('bluebird');
const BaseTask = require('./base-task');
const request = require('request-promise');
const config = require('../shared/config').cw;

class OfficesImportTask extends BaseTask{
    constructor(){
        super('offices-import');
    }
    login(){
        console.log("login")
        let reqDefaults = {
            baseUrl: config.apiBase,
            //json: true,
            headers: {
                'Content-Type': 'application/json',
            }
        };
        return req.post('session', {
                body: {
                    "username": config.user,
                    "password": config.pass
                }
            })
            .then(result => {
                console.log("result", result);
                return result;
            })
            .catch(err =>{
                console.log("error", err)
            })

    }
    _doRun(){
        return this.login();
    }
}

module.exports = OfficesImportTask;