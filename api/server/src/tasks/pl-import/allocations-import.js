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
        return userDa.find(query);
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

        var allocArray = [];

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

            if(weekNumber == 0){
                for(let user of users){
                    let alloc = {
                        id: user.phonelistId,
                        startDate: [],
                        weekHours:[],
                        workingWeekHours: [],
                        totalHours: 0
                    };
                    allocArray.push(alloc);
                }
            }

            return _this.callPostWebServices('gateway/json/empAllocations.asmx/getEmployeeAllocations', postData).then(allocationResponse => {
                for(let alloc of allocArray){
                    let allocItem = _.find(allocationResponse, (item) => {
                        return alloc.id == item.UserID;
                    });

                    alloc.startDate.push(stDate);

                    if(allocItem){
                        alloc.weekHours.push(allocItem.AllocatedHrs);
                        alloc.workingWeekHours.push(allocItem.AvailableHrs);
                        alloc.totalHours += allocItem.AllocatedHrs;
                    } else {
                        alloc.weekHours.push(-1);
                        alloc.workingWeekHours.push(-1);
                    }
                }

                nextWeek();
            });
        }).then(() => {
            return asyncMap(allocArray, function (allocData, callback) {
                var userLocalID = usersID_Phonelist.filter(function(findItem) {
                    return findItem.phonelistId == allocData.id;
                });

                var newAlloc = _.omit(allocData, ["id"]);

                _this._updateUser(userLocalID[0]['localId'], newAlloc)
                    .then(partialInfo => {
                        callback(null, partialInfo);
                    })
                    .catch((partialInfo) => {
                        callback(null, partialInfo);
                    });

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

    _updateUser(userId, allocData){
        let info = {updated: 1, skipped: 0, notFound: 0, errors: 0};
        let error = {updated: 1, skipped: 0, notFound: 0, errors: 0};

        let userDa = new UserDa();
            return userDa.setAllocation(userId, allocData)
            .then(() => info)
            .catch(err => {
                console.log("err", err)
                console.log("allocData", allocData)
                return error;
            });
    }

    _doRun(){
    	let _this = this;
    	//console.log(_this._getLastSunday());

        return this._findAndUpdateUsers();
    }
}

module.exports = AllocationsImportTask;