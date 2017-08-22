'use strict'
const errors = require('../../shared/errors');
const P = require('bluebird');
const BaseTask = require('../base-task');
const request = require('request');
const config = require('../../shared/config').cw;

class CwBaseTask extends BaseTask{
    constructor(name){
        super(name);
    }
    _login(){
        let reqDefaults = {
            baseUrl: config.apiBase,
            json: true,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        let req = request.defaults(reqDefaults);
        let reqPost = P.promisify(req.post);

        return reqPost('session', {body: { 
                        username: config.user, 
                        password: config.pass,
                        method: 'jwt'
            }})
            .then(result => {
                // let cookie = result.headers['set-cookie'].pop().replace(/.*(id\.api\.cw\.rga\.com=[^;]*).*/, '$1');
                // //console.log("cookie", cookie);  
                // reqDefaults.headers.Cookie = [cookie];  
                let accessToken = result.body.access_token;
                reqDefaults.headers.authorization = 'Bearer ' + accessToken;                
                let reqAux = request.defaults(reqDefaults);
                return {
                    get: P.promisify(reqAux.get),
                    post: P.promisify(reqAux.post)
                };
            })
            .catch(err =>{
                throw new errors.GenericError("Error login in CW", err);
            })
    }
}

module.exports = CwBaseTask;