'use strict'
let path = require('path');
let envFile = path.resolve(__dirname, "../.env");
require('dotenv').config({path: envFile});

const _ = require('lodash');
const P = require('bluebird');
const request = require('request');
const errors = require('../shared/errors');
const config = require('../shared/config').cw;

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
                "username": config.user, 
                "password": config.pass
    }})
    .then(result => {
        console.log('headers', result);
        let cookie = result.headers['set-cookie'].pop().replace(/.*(id\.api\.cw\.rga\.com=[^;]*).*/, '$1');
        //console.log("cookie", cookie);  
        reqDefaults.headers.Cookie = [cookie];           
        let reqAux = request.defaults(reqDefaults);
        return {
            get: P.promisify(reqAux.get),
            post: P.promisify(reqAux.post)
        };
    })
    .catch(err =>{
        console.log("error", err)
    })
