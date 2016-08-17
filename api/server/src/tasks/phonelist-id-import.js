'use strict'
const _ = require('lodash');
const async = require('async');
const fs = require('fs');
const errors = require('../shared/errors');
const P = require('bluebird');
const UserDa = require('../data-access/user');
const BaseTask = require('./base-task');
const path = require('path');
const tmpPhonelistFile = path.resolve(__dirname, "../tmp/employees.json");

const request = require('request');

let asyncDoUntil = P.promisify(async.doUntil);
let asyncMap = P.promisify(async.map);

const taskname ='phonelist-id-import';
const phonelistUrl = 'http://phonelist/gateway/json/employees.aspx'

class PhonelistIdImportTask extends BaseTask{
    constructor(){
        super(taskname);
    }
    // _getPhonelistEmployees(){
    //     const fs = require("fs");
    //     let path = require('path');
    //     let file = path.resolve(__dirname, "./e.json");
    //     fs.readFile = P.promisify(fs.readFile);
    //     return fs.readFile(file, 'utf8')
    //         .then(test => {
    //             return JSON.parse(test).employees;
    //         })
    // }
    _getPhonelistEmployees(){
        return new P((resolve, reject) => {
            let stream = request.get(phonelistUrl)
                .pipe(fs.createWriteStream(tmpPhonelistFile));
            stream.on('finish', () => {
                let json = require(tmpPhonelistFile);
                resolve(json.employees);
            });
            stream.on('error', (err) => {
                reject(err);
            });
        });
    }
    _getUsernameIdMap(plEmployees){
        let usernameIdmap = {};
        plEmployees.forEach(e => {
            let username = e.ADkey;
            if(!usernameIdmap[username])
                usernameIdmap[username] = e.ID;
        });
        return usernameIdmap;
    }
    _findAndUpdateUsers() {
        const limit = 10;
        let skip = 0;
        let info = {
            updated: 0,
            skipped: 0,
            errors: 0
        };
        let totalUsers = 0;
        return asyncDoUntil(callback => {
            this._getUsers(skip, limit)
                .then(data => {
                    totalUsers = data.paged.totalCount;
                    return this._updateUsers(data.data);
                })
                .then(partialInfo => callback(null, partialInfo))
                .catch(err => callback(err));
        }, partialInfo => {
            skip += limit;
            info.updated += partialInfo.updated;
            info.skipped += partialInfo.skipped;
            info.errors += partialInfo.errors;
            return (skip >= totalUsers);
        })
        .then(() => {
            return info;
        });
    }
    _getUsers(skip, limit){
        //TODO to mark ex employees qe should iterate all users, not just users without phonelistId
        let query = {phonelistId: null, paged: {skip: skip, limit: limit}}; 
        let userDa = new UserDa();
        return userDa.find(query);
    }
    _updateUsers(users){
        let _this = this;
        let info = {
            updated: 0,
            skipped: 0,
            errors: 0,
            total: function(){ return this.updated + this.errors; }
        };
        return asyncMap(users, function (u, callback) {
            try{
                _this._updateUser(u)
                    .then(partialInfo => {
                        callback(null, partialInfo);
                    })
            }catch(err){
                callback(err);
            }
        })
        .then(infoArray => {
            for(let i of infoArray){
                info.updated += i.updated;
                info.skipped += i.skipped;
                info.errors += i.errors;
            }
            return info;
        });
    }
    _updateUser(user){
        let phonelistId = this.usernameIdmap[user.username];
        if(phonelistId && !user.phonelistId){
            let userDa = new UserDa();
            return userDa.update({id: user.id, phonelistId: phonelistId}, true)
                .then(() => {
                    return {updated: 1, skipped: 0, errors: 0};
                })
                .catch(err => {
                    console.log(taskname + " - error setting phonelistId for user " + user.username);
                    return {updated: 0, skipped: 0, errors: 1};
                })
        } else{
            //TODO update user as ex user??
            return P.resolve({updated: 0, skipped: 0, errors: 0});
        }
    }
    _doRun(){
        return this._getPhonelistEmployees()
            .then(es => {
                return this._getUsernameIdMap(es);
            })
            .then(map => {
                this.usernameIdmap = map;
                return this._findAndUpdateUsers();
            });
    }
}

module.exports = PhonelistIdImportTask;