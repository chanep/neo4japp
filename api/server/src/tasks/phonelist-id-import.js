'use strict'
const _ = require('lodash');
const async = require('async');
const errors = require('../shared/errors');
const P = require('bluebird');
const UserDa = require('../data-access/user');
const BaseTask = require('./base-task');

async.doUntil = P.promisify(async.doUntil);
async.map = P.promisify(async.map);

const taskname ='phonelist-id-import';


class PhonelistIdImportTask extends BaseTask{
    constructor(){
        super(taskname);
    }
    _getPhonelistEmployees(){
        const fs = require("fs");
        let path = require('path');
        let file = path.resolve(__dirname, "./e.json");
        fs.readFile = P.promisify(fs.readFile);
        return fs.readFile(file, 'utf8')
            .then(test => {
                return JSON.parse(test).employees;
            })
    }
    // _getPhonelistEmployees(){
        
    // }
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
            errors: 0
        };
        return async.doUntil(callback => {
            this._getUsers(skip, limit)
                .then(data => this._updateUsers(data.data))
                .then(partialInfo => callback(null, partialInfo))
                .catch(err => callback(err));
        }, partialInfo => {
            skip += limit;
            info.updated += partialInfo.updated;
            info.errors += partialInfo.errors;
            return (partialInfo.total() == 0);
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
            errors: 0,
            total: function(){ return this.updated + this.errors; }
        };
        return async.map(users, function (u, callback) {
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
                    return {updated: 1, errors: 0};
                })
                .catch(err => {
                    console.log(taskname + " - error setting phonelistId for user " + user.username);
                    return {updated: 0, errors: 1};
                })
        } else{
            //TODO update user as ex user??
            return P.resolve({updated: 0, errors: 0});
        }
    }
    _doRun(){
        return this._getPhonelistEmployees()
            .then(es => {
                return this._getUsernameIdMap(es);
            })
            .then(map => {
                this.usernameIdmap = map;
                console.log("map", map)
                return this._findAndUpdateUsers();
            });
    }
}

module.exports = PhonelistIdImportTask;