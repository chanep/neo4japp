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
            console.log("info", info);
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

        var usersID_Phonelist = [];
        var usersIDs = [];
		users.forEach(function(item) {
            var newID = [];
            newID.push(item.phonelistId); //this is a fix just because the services need the ID into an array.
			usersIDs.push(newID);
            usersID_Phonelist.push({
                localId: item.id,
                phonelistId: item.phonelistId
            });
		});

        var weeks = [0, 1, 2, 3];

        var dataAlloc = [];

        async.eachSeries = P.promisify(async.eachSeries);
        return async.eachSeries(weeks, function iteratee(weekNumber, nextWeek) {
            var startWeek = new moment(_this._getLastSunday(0 + (7 * weekNumber)));
            var endWeek = new moment(_this._getLastSunday(6 + (7 * weekNumber)));
            var stDate = startWeek.format("MM-DD-YYYY");
            var enDate = endWeek.format("MM-DD-YYYY");

            var postData = querystring.stringify({
              employeeId: JSON.stringify(usersIDs),
              startDate: stDate,
              endDate: enDate
            });

            return _this.callPostWebServices('gateway/json/empAllocations.asmx/getEmployeeAllocations', postData).then(allocationData => {
                allocationData.forEach(function(item) {
                    var userData = dataAlloc.filter(function(findItem) {
                        return findItem.id == item['UserID'];
                    });

                    if (userData.length == 0){
                        var newUser = {
                            'id': item['UserID'],
                            'startDate': [stDate],
                            'weekHours': [item['AllocatedHrs']],
                            'totalHours': item['AllocatedHrs']
                        };

                        dataAlloc.push(newUser);
                    } else {
                        var currentUser = userData[0];
                        
                        currentUser.startDate.push(stDate);
                        currentUser.weekHours.push(item['AllocatedHrs']);
                        currentUser.totalHours += item['AllocatedHrs'];
                    }
                });

                nextWeek();
            });
        }).then(() => {
            return asyncMap(dataAlloc, function (userData, callback) {
                try{
                    var userLocalID = usersID_Phonelist.filter(function(findItem) {
                        return findItem.phonelistId == userData.id;
                    });
                    userData.id = userLocalID[0]['localId'];
                    _this._updateUser(userData).then(partialInfo => {
                        callback(null, partialInfo);
                    });
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

    _updateUser(userData){
        let info = {updated: 1, skipped: 0, notFound: 0, errors: 0};

        var userDa = new UserDa();
        try{
            return userDa.setAllocation(userData.id, userData)
            .then(() => info);
        } catch(err){
            console.log("err", err)
            return P.reject(err);
        }
        
    }

    _doRun(){
    	let _this = this;
    	//console.log(_this._getLastSunday());

        return this._findAndUpdateUsers();
    }
}

module.exports = AllocationsImportTask;