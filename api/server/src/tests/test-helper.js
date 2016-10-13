'use strict'
var path = require('path');
var envFile = path.resolve(__dirname, "../.test-env");
require('dotenv').config({path: envFile});

const config = require('../shared/config');
const partitionSuffix = config.db.partitionSuffix;
const testDbHelper = require('./test-db-helper');
const request = require('request');
const assert = require('assert'); 

module.exports = {
    resetTestDbBatch: function(){
        return {
            'reset db' : {
                topic: function(){
                    var _this = this;
                    testDbHelper.resetDb(partitionSuffix)
                        .then(function(){
                            _this.callback(null)
                        })
                        .catch(function(err){
                            _this.callback(err, null)
                        });
                },
                'db reset' : function(err){
                    if(err){
                        console.log("error resetting db ", err)
                        throw err;
                    } else{
                        //console.log("db " + dbName + " has been reset")
                    }
                }
            }
        }
    },
    assertSuccess : function(){
        return function(err, res, body){
            assert.equal(res.statusCode, '200')
            assert.equal(body.status, 'success');
        }
    }, 
    assertHTTPCode: function(code){
        return function(err, res, body){
            assert.equal(res.statusCode, code)
        }
    },
    loginBatch: function (reqCallback, usernameFunction, passwordFunction) {
        usernameFunction = usernameFunction || (() => 'pepetest');
        passwordFunction = passwordFunction || (() => 'skill123');
        return {
            'login': {
                topic: function () {
                    var _this = this;
                    var reqDefaults = {
                        baseUrl: config.apiBaseUrl,
                        json: true,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    };

                    let req = request.defaults(reqDefaults);

                    let username = usernameFunction();
                    let password = passwordFunction();
                    req.post('session', {
                        body: {
                            "username": username,
                            "password": password
                        }
                    }, function (err, res, body) {
                        if(err){
                            console.log("err",err);
                        }
                        let cookie = res.headers['set-cookie'].pop().match(/(connect\.sid=.+?);/)[1];
                        reqDefaults.headers.Cookie = cookie;
                        req = request.defaults(reqDefaults);
                        if (!err) {
                            _this.callback(null, req)
                        } else {
                            _this.callback(err, null)
                        }
                    });
                },
                'login result': function (err, request) {
                    if (err) {
                        console.log("error logging in ", err)
                        throw err;
                    } else {
                        reqCallback(request);
                    }
                }
            }
        }
    },
    createUserBatch: function(callback){
        return {
            'create user' : {
                topic: function(){
                    var _this = this;
                    testDbHelper.createUser()
                        .then(function(user){
                            _this.callback(null, user)
                        })
                        .catch(function(err){
                            _this.callback(err, null)
                        });
                },
                'create user result' : function(err, result){
                    if(err){
                        console.log("error creating user ", err)
                        throw err;
                    }else{
                        callback(result);
                    }
                }
            }
        }
    },
    createSkillGroupsBatch: function(callback){
        return {
            'create skill groups' : {
                topic: function(){
                    var _this = this;
                    testDbHelper.createSkillGroups()
                        .then(function(groups){
                            _this.callback(null, groups)
                        })
                        .catch(function(err){
                            _this.callback(err, null)
                        });
                },
                'result' : function(err, result){
                    if(err){
                        console.log("error creating skill groups ", err)
                        throw err;
                    }else{
                        callback(result);
                    }
                }
            }
        }
    },    
    createBasicDataBatch: function(callback){
        return {
            'create basic data' : {
                topic: function(){
                    var _this = this;
                    testDbHelper.createBasicData()
                        .then(function(data){
                            _this.callback(null, data)
                        })
                        .catch(function(err){
                            _this.callback(err, null)
                        });
                },
                'create basic data result' : function(err, result){
                    if(err){
                        console.log("error creating basic data ", err)
                        throw err;
                    }else{
                        callback(result);
                    }
                }
            }
        }
    },
};