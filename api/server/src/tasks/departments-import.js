'use strict'
const _ = require('lodash');
const async = require('async');
const errors = require('../shared/errors');
const P = require('bluebird');
const CwBaseTask = require('./cw-base');
const DepartmentDa = require('../data-access/department');

class DepartmentsImportTask extends CwBaseTask{
    constructor(){
        super('departments-import');
    }
    _getDepartments(){
        return this._req.get('department?ipp=200')
            .then(r => r.body.data);
    }
    _importDepartments(departments) {
        let _this = this;
        let info = {
            updated: 0,
            created: 0,
            errors: 0
        };
        let departmentDa = new DepartmentDa();

        async.eachSeries = P.promisify(async.eachSeries);
        return async.eachSeries(departments, function (d, callback) {
            let department = _this._transformDepartment(d);
            departmentDa.upsert(department, ["sourceId"])
                .then(r => {
                    if (r.created) {
                        info.created++;
                    } else {
                        info.updated++;
                    }
                    callback();
                })
                .catch(err => {
                    info.errors++;
                    let e = new errors.GenericError("Error importing department:" + department, err);
                    console.log(e);
                    callback();
                })
        })
        .then(() => {
            console.log("info", info)
            return info;
        });
    }
    _transformDepartment(source){
        let department = _.pick(source, ["name"]);
        department.sourceId = source._id;
        return department;
    }
    _doRun(){
        return this._login()
            .then(req => {
                this._req = req;
                return this._getDepartments();
            })
            .then(departments => {
                return this._importDepartments(departments);
            });
    }
}

module.exports = DepartmentsImportTask;