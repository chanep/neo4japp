'use strict'
const async = require('async');
const errors = require('../../shared/errors');
const P = require('bluebird');
const BaseTask = require('../base-task');
const phonelistIdImportTask = new (require('./phonelist-id-import'));
const clientsImportTask = new (require('./clients-import'));
const userClientsImportTask = new (require('./user-clients-import'));
const approversImportTask = new (require('./approvers-import'));
const resourceManagersImportTask = new (require('./resource-managers-import'));
const allocationsImportTask = new (require('./allocations-import'));

class ImportAllTask extends BaseTask{
    constructor(){
        super('import-all');
    }
    _doRun(){
        return phonelistIdImportTask.run()
            .then(info => {
                return clientsImportTask.run();
            })
            .then(info => {
                return userClientsImportTask.run();
            })
            .then(info => {
                return approversImportTask.run();
            })
            .then(info => {
                return resourceManagersImportTask.run();
            })
            .then(info => {
                return {message: 'Import all task finished ok'};
            });
    }
}

module.exports = ImportAllTask;