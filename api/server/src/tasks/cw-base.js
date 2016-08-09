'use strict'
const errors = require('../shared/errors');
const P = require('bluebird');
const BaseTask = require('./base-task');
const request = require('request');
const config = require('../shared/config').cw;


request.get = P.promisify(request.get);
request.post = P.promisify(request.post);
request.put = P.promisify(request.put);
request.del = P.promisify(request.del);

class CwBaseTask extends BaseTask{
    constructor(name){
        super(name);
    }
    _login(){
        console.log("login")
        let reqDefaults = {
            baseUrl: config.apiBase,
            json: true,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        let req = request.defaults(reqDefaults);
        return req.post('session', {body: { 
                        "username": config.user, 
                        "password": config.pass
            }})
            .then(result => {
                let cookie = result.headers['set-cookie'].pop().replace(/.*(id\.api\.cw\.rga\.com=[^;]*).*/, '$1');
                //console.log("cookie", cookie);  
                reqDefaults.headers.Cookie = [cookie];           
                console.log("Logged In CW");
                return request.defaults(reqDefaults);
            })
            .catch(err =>{
                console.log("login error", err)
                throw new errors.GenericError("Error login in CW", err);
            })
    }
}

module.exports = CwBaseTask;