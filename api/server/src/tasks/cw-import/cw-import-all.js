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
        console.log(`Task ${officesImportTask.name} started...`);
        return officesImportTask.run()
            .then(info => {
                console.log(`Task ${officesImportTask.name} finished ok. Info: ${JSON.stringify(info)}`);
                console.log(`Task ${departmentsImportTask.name} started...`);
                return departmentsImportTask.run();
            })
            .then(info => {
                console.log(`Task ${departmentsImportTask.name} finished ok. Info: ${JSON.stringify(info)}`);
                console.log(`Task ${positionsImportTask.name} started...`);
                return positionsImportTask.run();
            })
            .then(info => {
                console.log(`Task ${positionsImportTask.name} finished ok. Info: ${JSON.stringify(info)}`);
                console.log(`Task ${usersImportTask.name} started...`);
                return usersImportTask.run()
            })
            .then(info => {
                console.log(`Task ${usersImportTask.name} finished ok. Info: ${JSON.stringify(info)}`);
                return {message: 'Offices, Departments, Positions and User were imported from CW'};
            });
    }
}

module.exports = CwImportAllTask;