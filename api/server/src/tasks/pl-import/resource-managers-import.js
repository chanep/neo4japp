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

const taskname ='resource-managers-import';
const phonelistUrl = 'http://phonelist/gateway/json/employeeResourceManager.aspx'

class ResourceManagersImportTask extends BaseTask{
    constructor(){
        super(taskname);
    }
    _getUserResourceManagersEmail(phonelistId){
        if(this.phonelistIdToEmail.has(phonelistId))
            return P.resolve(this.phonelistIdToEmail.get(phonelistId));
        return new P((resolve, reject) => {
            let url = phonelistUrl + '?e=' + phonelistId;
            request.get(url, 
                    (err, result, body) => {
                        if(err){
                            reject(new errors.GenericError('error getting resourceManagers of user ' + phonelistId, err))
                        } else {
                            try{
                                let json = JSON.parse(body);
                                let user = json.Info[0];
                                user.RM = user.RM || [];
                                let emails = user.RM.map(m => m.useremail.toLowerCase());
                                this.phonelistIdToEmail.set(phonelistId, emails);
                                resolve(emails);
                            } catch(err){
                                reject(new errors.GenericError('error getting resourceManagers of user ' + phonelistId, err))
                            }
                        }
                    })
        });
    }
    _getUserResourceManagersId(phonelistId){
        return this._getUserResourceManagersEmail(phonelistId)
            .then(emails => {
                return asyncMap(emails, (email, callback) => {
                    this._getUserIdByEmail(email)
                        .then(resourceManagerId => {
                            callback(null, resourceManagerId);
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
                this.notFoundResourceManagers.add(email);
                return null;
            });
    }
    _findUsers(skip, limit){
        let query = {disabled: false, phonelistId: {$ne: null}, paged: {skip: skip, limit: limit}};
        return userDa.find(query);
    }
    _getAndUpdateUsersResourceManagers(users){
        return asyncEach(users, (user, callback) =>{
            this._getAndUpdateUserResourceManagers(user)
                .finally(() => {
                    callback();
                })
        })
    }
    _getAndUpdateUserResourceManagers(user){
        let updated = false;
        return userDa.clearResourceManagers(user.id)
            .then(() => {
                return this._getUserResourceManagersId(user.phonelistId);
            })
            .then(resourceManagersId => {
                return asyncEach(resourceManagersId, (resourceManagerId, callback) => {
                    if(!resourceManagerId){
                        //this.info.errors++;
                        callback();
                    } else{
                        userDa.addResourceManager(user.id, resourceManagerId)
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
                console.log(taskname + ` error updating ${user.username} resourceManagers`, err);
                this.info.errors++;
            })
    }
    _findAndUpdateAllUsers() {
        const limit = 20;
        let skip = 0;
        let totalUsers = 0;

        return asyncDoUntil(callback => {
            this._findUsers(skip, limit)
                .then(data => {
                    totalUsers = data.paged.totalCount;
                    let users = data.data;
                    return this._getAndUpdateUsersResourceManagers(users);
                })
                .then(() => callback(null))
                .catch(err => callback(err));
        }, () => {
            skip += limit;
            //return true;
            if((skip % 200 == 0))
                console.log(taskname + ' - ' + skip + ' users processed...');
            return (skip >= totalUsers);
        });
    }
    _doRun(){
        this.info = {updated: 0, errors: 0, resourceManagersNotFound: 0};
        this.phonelistIdToEmail = new Map();
        this.emailToUserId = new Map();
        this.notFoundResourceManagers = new Set();

        return this._findAndUpdateAllUsers()
            .then(() => {
                return userDa.updateResourceManagerRole();;
            })
            .then(count => {
                console.log(count + ' have modified their resourceManager role');
                if(this.notFoundResourceManagers.size > 0)
                    console.log('Not found resourceManagers', this.notFoundResourceManagers);
                this.info.resourceManagersNotFound = this.notFoundResourceManagers.size;
                return this.info;
            });
    }
}

module.exports = ResourceManagersImportTask;