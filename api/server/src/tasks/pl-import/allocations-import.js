'use strict'
const _ = require('lodash');
const querystring = require('querystring');
const http = require('http');
const async = require('async');
const errors = require('../../shared/errors');
const P = require('bluebird');
const PlBaseTask = require('./pl-base');
const UserDa = require('../../data-access/user');
const AllocationDa = require('../../data-access/allocation');
const moment = require('moment');

let asyncDoUntil = P.promisify(async.doUntil);
let asyncMap = P.promisify(async.map);

class AllocationsImportTask extends PlBaseTask{
    constructor(){
        super('allocations-import');
    }

	_getLastSunday(addDays) {
	  var d = new Date();
	  var day = d.getDay(),
	      diff = d.getDate() - day + (day == 0 ? -6:1) + addDays;
	  return new Date(d.setDate(diff));
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

        var usersIDs = [];
		users.forEach(function(item) {
            var newID = [];
            newID.push(item.phonelistId); //this is a fix just because the services need the ID into an array.
			usersIDs.push(newID);
		});

        var startWeek = new moment(this._getLastSunday(0));
        var endWeek = new moment(this._getLastSunday(6));
        var stDate = startWeek.format("MM-DD-YYYY");
		var enDate = endWeek.format("MM-DD-YYYY");
		var postData = querystring.stringify({
		  employeeId: JSON.stringify(usersIDs),
		  startDate: stDate,
		  endDate: enDate
		});

        return _this.callPostWebServices('gateway/json/empAllocations.asmx/getEmployeeAllocations', postData).then(result => {
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
        });
    }

    _updateUser(user){
        let info = {updated: 0, skipped: 0, notFound: 0, errors: 0};

        return P.resolve(info);
    }

    _doRun(){
    	let _this = this;
    	//console.log(_this._getLastSunday());

        return this._findAndUpdateUsers();
    }
}

module.exports = AllocationsImportTask;