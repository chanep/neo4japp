'use strict'
const _ = require('lodash');
const async = require('async');
const errors = require('../../shared/errors');
const P = require('bluebird');
const CwBaseTask = require('./cw-base');
const officesImportTask = require('./offices-import');
const departmentImportTask = require('./departments-import');
const positionsImportTask = require('./positions-import');
const usersImportTask = require('./users-import');

class CwImportAllTask extends CwBaseTask{
    constructor(){
        super('cw-import-all');
    }
    _doRun(){
        return officesImportTask.run()
            .then(() => departmentImportTask.run())
            .then(() => positionsImportTask.run())
            .then(() => usersImportTask.run());
    }
}

module.exports = CwImportAllTask;