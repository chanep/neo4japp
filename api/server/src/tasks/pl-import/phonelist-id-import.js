'use strict'
const _ = require('lodash');
const async = require('async');
const fs = require('fs');
const errors = require('../../shared/errors');
const P = require('bluebird');
const UserDa = require('../../data-access/user');
const BaseTask = require('../base-task');
const path = require('path');
const roles = require('../../models/roles');
const tmpPhonelistFile = path.resolve(__dirname, "../../tmp/employees.json");

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
                //resolve(json.employees.slice(0,100));
                resolve(json.employees);
            });
            stream.on('error', (err) => {
                reject(err);
            });
        });
    }
    _getUsernameIdMap(plEmployees){
        console.log("employees count", plEmployees.length)
        let usernameIdmap = {};
        plEmployees.forEach(e => {
            let username = e.ADkey.toLowerCase();
            if(!usernameIdmap[username])
                usernameIdmap[username] = {phonelistId: e.ID, level: e.level};
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
        //let query = {phonelistId: null, paged: {skip: skip, limit: limit}}; 
        let query = {paged: {skip: skip, limit: limit}};
        let userDa = new UserDa();
        return userDa.find(query);
    }
    _updateUsers(users){
        let _this = this;
        let info = {
            updated: 0,
            skipped: 0,
            errors: 0,
            total: function(){ return this.updated + this.errors + this.skipped; }
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
        let info = {updated: 0, skipped: 0, errors: 0};
        let phonelistUser = this.usernameIdmap[user.username];
        let existsInPhonelist = !!phonelistUser;
        
        if(phonelistUser){
            delete this.usernameIdmap[user.username];
        }

        let mustUpdate = false;
        let updateData = {id: user.id};
        if(!existsInPhonelist && !user.disabled){
            mustUpdate = true;
            updateData.disabled = true;
        }

        if(existsInPhonelist && (phonelistUser.phonelistId != user.phonelistId || phonelistUser.level != user.level || user.disabled)){
            mustUpdate = true;
            updateData.phonelistId = phonelistUser.phonelistId;
            updateData.level = phonelistUser.level;
            updateData.disabled = false;
        }

        if(existsInPhonelist){
            if(!user.roles)
                user.roles = [];
            let searcherRole = (phonelistUser.level == 'Executive' || phonelistUser.level == 'Leadership');
            if(roles.hasRole(user.roles, roles.searcher) != searcherRole){
                mustUpdate = true;
                if(searcherRole)
                    roles.addRole(user.roles, roles.searcher);
                else
                    roles.removeRole(user.roles, roles.searcher);
                updateData.roles = user.roles;
            }
        }
        
            
        if(mustUpdate){
            let userDa = new UserDa();
            return userDa.update(updateData, true)
                .then(() => {
                    //console.log("updated user " + user.username)
                    info.updated++;
                    return info;
                })
                .catch(err => {
                    console.log(taskname + " - error setting phonelistId for user " + user.username);
                    info.errors++;
                    return info;
                })
        } else{
            info.skipped++;
            return P.resolve(info);
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
            })
            .then(info => {
                console.log("orphan phonelist users", JSON.stringify(_.keys(this.usernameIdmap)))
                console.log("orphan phonelist user count", _.keys(this.usernameIdmap).length)
                return info;
            });
    }
}

module.exports = PhonelistIdImportTask;