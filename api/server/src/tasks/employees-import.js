'use strict'
const _ = require('lodash');
const async = require('async');
const errors = require('../shared/errors');
const P = require('bluebird');
const CwBaseTask = require('./cw-base');
const EmployeeDa = require('../data-access/employee');
const OfficeDa = require('../data-access/office');
const DepartmentDa = require('../data-access/department');
const PositionDa = require('../data-access/position');



class EmployeesImportTask extends CwBaseTask{
    constructor(){
        super('employees-import');
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
    _getEmployees(page, ipp){
        return this._req.get(`user?filters[]=type=UserEmployee&p=${page}&ipp=${ipp}`)
            .then(r => r.body.data);
    }
    _importEmployees(employees) {
        let _this = this;
        let info = {
            updated: 0,
            created: 0,
            errors: 0,
            total: function(){ return this.updated + this.created + this.errors; }
        };
        async.eachSeries = P.promisify(async.eachSeries);
        return async.eachSeries(employees, function (e, callback) {
            _this._importEmployee(e)
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
    _importEmployee(sourceEmployee){
        let employee = this._transformEmployee(sourceEmployee);
        let departmentId = employee.departmentId;
        let positionId = employee.positionId;
        let officeId = employee.officeId;
        _.remove(employee, ["departmentId", "positionId", "officeId"]);
        let info = {
            updated: 0,
            created: 0,
            errors: 0
        };
        const mergeKeys = true;
        let eId;

        let employeeDa = new EmployeeDa();
        return employeeDa.upsert(employee, ["sourceId"], mergeKeys)
            .then(e => {
                eId = e.data.id;
                if (e.created) {
                        info.created++;
                    } else {
                        info.updated++;
                    }
                if(!positionId)
                    return;
                return employeeDa.setPosition(eId, positionId);
            })
            .then(() => {
                if(!departmentId)
                    return;
                return employeeDa.setDepartment(eId, departmentId);
            })
            .then(() => {
                if(!officeId)
                    return;
                return employeeDa.setOffice(eId, officeId);
            })
            .catch((err) => {
                let e = new errors.GenericError("Error importing employee:" + employee, err);
                console.log(e);
                info.errors++;
            })
            .then(() => {
                return info;
            })
    }
    _transformEmployee(source){
        let s = source;
        let employee = {
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
            employee.image = s.main_image.sizes.one_one.s320x320;
        if(s.data && s.data.department){
            let sourceId = s.data.department._id;
            if(this.departmentsMap[sourceId])
                employee.departmentId = this.departmentsMap[sourceId];
        }
        if(s.data && s.data.position){
            let sourceId = s.data.position._id;
            if(this.positionsMap[sourceId])
                employee.positionId = this.positionsMap[sourceId];
        }
        if(s.data && s.data.office){
            let sourceId = s.data.office._id;
            if(this.officesMap[sourceId])
                employee.officeId = this.officesMap[sourceId];
        }

        return employee;
    }
    _getAndImportEmployees() {
        let ipp = 50;
        let info = {
            updated: 0,
            created: 0,
            errors: 0
        };
        let page = 1;

        async.doUntil = P.promisify(async.doUntil);
        return async.doUntil(callback => {
            this._getEmployees(page, ipp)
                .then(es => this._importEmployees(es))
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
                return this._getAndImportEmployees();
            });
    }
}

module.exports = EmployeesImportTask;