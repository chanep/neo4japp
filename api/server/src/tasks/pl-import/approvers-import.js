'use strict'
const _ = require('lodash');
const async = require('async');
const fs = require('fs');
const errors = require('../../shared/errors');
const P = require('bluebird');
const userDa = new (require('../../data-access/user'));
const BaseTask = require('../base-task');
const path = require('path');

const request = require('request');

let asyncDoUntil = P.promisify(async.doUntil);
let asyncMap = P.promisify(async.map);
let asyncEach = P.promisify(async.each);

const taskname ='approvers-import';
const phonelistUrl = 'http://phonelist/gateway/json/employeeManager.aspx'

class ApproversImportTask extends BaseTask{
    constructor(){
        super(taskname);
    }
    _getUserApproversEmail(phonelistId){
        if(this.phonelistIdToEmail.has(phonelistId))
            return P.resolve(this.phonelistIdToEmail.get(phonelistId));
        return new P((resolve, reject) => {
            let url = phonelistUrl + '?e=' + phonelistId;
            request.get(url, 
                    (err, result, body) => {
                        if(err){
                            reject(new errors.GenericError('error getting approvers of user ' + phonelistId, err))
                        } else {
                            try{
                                let json = JSON.parse(body);
                                let user = json.Info[0];
                                let emails = user.managers.map(m => m.useremail.toLowerCase());
                                this.phonelistIdToEmail.set(phonelistId, emails);
                                resolve(emails);
                            } catch(err){
                                reject(new errors.GenericError('error getting approvers of user ' + phonelistId, err))
                            }
                        }
                    })
        });
    }
    _getUserApproversId(phonelistId){
        return this._getUserApproversEmail(phonelistId)
            .then(emails => {
                return asyncMap(emails, (email, callback) => {
                    this._getUserIdByEmail(email)
                        .then(approverId => {
                            callback(null, approverId);
                        })
                        .catch(err => {
                            callback(err);
                        })
                });
            })
    }
    _getUserIdByEmail(email){
        if(this.emailToUserId.has(email))
            return P.resolve(this.emailToUserId.get(email));
        
        return userDa.findOne({email: email})
            .then(u => {
                if(u){
                    this.emailToUserId.set(email, u.id);
                    return u.id;
                }
                this.notFoundApprovers.add(email);
                return null;
            });
    }
    _findUsers(skip, limit){
        let query = {disabled: false, phonelistId: {$ne: null}, paged: {skip: skip, limit: limit}};
        return userDa.find(query);
    }
    _getAndUpdateUsersApprovers(users){
        return asyncEach(users, (user, callback) =>{
            this._getAndUpdateUserApprovers(user)
                .finally(() => {
                    callback();
                })
        })
    }
    _getAndUpdateUserApprovers(user){
        let updated = false;
        return this._getUserApproversId(user.phonelistId)
            .then(aproversId => {
                return asyncEach(aproversId, (approverId, callback) => {
                    if(!approverId){
                        this.info.errors++;
                        callback();
                    } else{
                        userDa.setApprover(user.id, approverId)
                            .then(() => {
                                updated = true;
                                callback();
                            })
                            .catch(err => {
                                callback(err);
                            })
                    }

                });
            })
            .then(() => {
                if(updated)
                    this.info.updated++;
            })
            .catch(err => {
                console.log(taskname + ` error updating ${user.username} approvers`, err);
                this.info.errors++;
            })
    }
    _findAndUpdateAllUsers() {
        const limit = 10;
        let skip = 0;
        let totalUsers = 0;

        return asyncDoUntil(callback => {
            this._findUsers(skip, limit)
                .then(data => {
                    totalUsers = data.paged.totalCount;
                    let users = data.data;
                    return this._getAndUpdateUsersApprovers(users);
                })
                .then(() => callback(null))
                .catch(err => callback(err));
        }, () => {
            skip += limit;
            //return true;
            if((skip % 200 == 0))
                console.log(taskname + ' - ' + skip + ' users updated...');
            return (skip >= totalUsers);
        });
    }
    _doRun(){
        this.info = {updated: 0, errors: 0};
        this.phonelistIdToEmail = new Map();
        this.emailToUserId = new Map();
        this.notFoundApprovers = new Set();

        return this._findAndUpdateAllUsers()
            .then(() => {
                console.log('Not found approvers', this.notFoundApprovers);
                return this.info;
            });
    }
}

module.exports = ApproversImportTask;