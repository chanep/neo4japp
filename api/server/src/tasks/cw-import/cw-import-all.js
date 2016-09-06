'use strict'
const _ = require('lodash');
const async = require('async');
const errors = require('../../shared/errors');
const P = require('bluebird');
const CwBaseTask = require('./cw-base');
const officesImportTask = new (require('./offices-import'));
const departmentsImportTask = new (require('./departments-import'));
const positionsImportTask = new (require('./positions-import'));
const usersImportTask = new (require('./users-import'));

class CwImportAllTask extends CwBaseTask{
    constructor(){
        super('cw-import-all');
    }
    _doRun(){
        return officesImportTask.run()
            .then(info => {
                return departmentsImportTask.run();
            })
            .then(info => {
                return positionsImportTask.run();
            })
            .then(info => {
                return usersImportTask.run()
            })
            .then(info => {
                return {message: 'Offices, Departments, Positions, User, Allocations were imported from CW'};
            });
    }
}

module.exports = CwImportAllTask;