'use strict'
const _ = require('lodash');
const async = require('async');
const errors = require('../shared/errors');
const config = require('../shared/config').googlespreadsheet;
const P = require('bluebird');
const BaseTask = require('./base-task');
const UserDa = require('../data-access/user');
const AllocationDa = require('../data-access/allocation');

let asyncDoUntil = P.promisify(async.doUntil);
let asyncMap = P.promisify(async.map);

class AllocationsImportTask extends BaseTask{
    constructor(){
        super('allocations-import');
    }

    _getUsers(skip, limit){
        let query = {$not: {phonelistId: null}, paged: {skip: skip, limit: limit}}; 
        let userDa = new UserDa();
        let data = userDa.find(query);
        console.log(data);
        return data;
    }

	_findAndUpdateUsers() {
        const limit = 25;
        let skip = 0;
        let info = {
            updated: 0,
            skipped: 0,
            errors: 0,
            notFound: 0
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
            info.notFound += partialInfo.notFound;
            return (skip >= totalUsers);
        })
        .then(() => {
            return info;
        });
    }

    _updateUsers(users){
        let _this = this;
        let info = {
            updated: 0,
            skipped: 0,
            errors: 0,
            notFound: 0,
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
                info.notFound += i.notFound;
            }
            return info;
        });
    }

    _updateUser(user){
        let info = {updated: 0, skipped: 0, notFound: 0, errors: 0};

        console.log(user);
        return P.resolve(info);
    }

    _doRun(){
    	let _this = this;

        return this._findAndUpdateUsers();
    }
}

module.exports = AllocationsImportTask;