'use strict'
const _ = require('lodash');
const async = require('async');
const errors = require('../shared/errors');
const P = require('bluebird');
const CwBaseTask = require('./cw-base');
const UserDa = require('../data-access/user');
const OfficeDa = require('../data-access/office');
const DepartmentDa = require('../data-access/department');
const PositionDa = require('../data-access/position');



class UsersImportTask extends CwBaseTask{
    constructor(){
        super('users-import');
    }
    _createOfficesMap(){      
        let officeDa = new OfficeDa();
        return officeDa.find()
            .then(os => {
                let map = {};
                os.forEach(o => {
                    if(o.sourceId)
                        map[o.sourceId] = o.id;
                })
                return map;
            });
    }
    _createDepartmentsMap(){      
        let departmentDa = new DepartmentDa();
        return departmentDa.find()
            .then(ds => {
                let map = {};
                ds.forEach(d => {
                    if(d.sourceId)
                        map[d.sourceId] = d.id;
                })
                return map;
            });
    }
    _createPositionsMap(){      
        let positionDa = new PositionDa();
        return positionDa.find()
            .then(ps => {
                let map = {};
                ps.forEach(p => {
                    if(p.sourceId)
                        map[p.sourceId] = p.id;
                })
                return map;
            });
    }
    _getUsers(page, ipp){
        return this._req.get(`user?filters[]=type=UserEmployee&p=${page}&ipp=${ipp}`)
            .then(r => r.body.data);
    }
    _importUsers(users) {
        let _this = this;
        let info = {
            updated: 0,
            created: 0,
            errors: 0,
            total: function(){ return this.updated + this.created + this.errors; }
        };
        async.eachSeries = P.promisify(async.eachSeries);
        return async.eachSeries(users, function (e, callback) {
            _this._importUser(e)
                .then(partialInfo => {
                    info.created += partialInfo.created;
                    info.updated += partialInfo.updated;
                    info.errors += partialInfo.errors;
                    callback();
                })
        })
        .then(() => {
            return info;
        });
    }
    _importUser(sourceUser){
        let user = this._transformUser(sourceUser);
        let departmentId = user.departmentId;
        let positionId = user.positionId;
        let officeId = user.officeId;
        _.remove(user, ["departmentId", "positionId", "officeId"]);
        let info = {
            updated: 0,
            created: 0,
            errors: 0
        };
        const mergeKeys = true;
        let uId;

        let userDa = new UserDa();
        return userDa.upsert(user, ["sourceId"], mergeKeys)
            .then(u => {
                uId = u.data.id;
                if (u.created) {
                        info.created++;
                    } else {
                        info.updated++;
                    }
                if(!positionId)
                    return;
                return userDa.setPosition(uId, positionId);
            })
            .then(() => {
                if(!departmentId)
                    return;
                return userDa.setDepartment(uId, departmentId);
            })
            .then(() => {
                if(!officeId)
                    return;
                return userDa.setOffice(uId, officeId);
            })
            .catch((err) => {
                let e = new errors.GenericError("Error importing user:" + user, err);
                console.log(e);
                info.errors++;
            })
            .then(() => {
                return info;
            })
    }
    _transformUser(source){
        let s = source;
        let user = {
            sourceId: s._id,
            username: s.username,
            type: s.type,
            email: s.email,
            fullname: s.fullname,
            first: s.first,
            last: s.last,
            phone: s.phone
        }
        if(s.main_image && s.main_image.sizes && s.main_image.sizes.one_one && s.main_image.sizes.one_one.s320x320)
            user.image = s.main_image.sizes.one_one.s320x320;
        if(s.data && s.data.department){
            let sourceId = s.data.department._id;
            if(this.departmentsMap[sourceId])
                user.departmentId = this.departmentsMap[sourceId];
        }
        if(s.data && s.data.position){
            let sourceId = s.data.position._id;
            if(this.positionsMap[sourceId])
                user.positionId = this.positionsMap[sourceId];
        }
        if(s.data && s.data.office){
            let sourceId = s.data.office._id;
            if(this.officesMap[sourceId])
                user.officeId = this.officesMap[sourceId];
        }

        return user;
    }
    _getAndImportUsers() {
        let ipp = 50;
        let info = {
            updated: 0,
            created: 0,
            errors: 0
        };
        let page = 1;

        async.doUntil = P.promisify(async.doUntil);
        return async.doUntil(callback => {
            this._getUsers(page, ipp)
                .then(us => this._importUsers(us))
                .then(partialInfo => callback(null, partialInfo))
                .catch(err => callback(err));
        }, partialInfo => {
            page++;
            info.created += partialInfo.created;
            info.updated += partialInfo.updated;
            info.errors += partialInfo.errors;
            // if(page == 4)
            //     return true;
            return (partialInfo.total() == 0);
        })
        .then(() => {
            return info;
        });
    }
    _doRun(){
        return this._login()
            .then(req => {
                this._req = req;
                return this._createDepartmentsMap();
            })
            .then(dm => {
                this.departmentsMap = dm;
                return this._createPositionsMap();
            })
            .then(pm => {
                this.positionsMap = pm;
                return this._createOfficesMap();
            })
            .then(om => {
                this.officesMap = om;
                return this._getAndImportUsers();
            });
    }
}

module.exports = UsersImportTask;