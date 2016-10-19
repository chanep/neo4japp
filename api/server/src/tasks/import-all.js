'use strict'
const async = require('async');
const errors = require('../shared/errors');
const P = require('bluebird');
const BaseTask = require('./base-task');
const skillsImportTask = new (require('./skills-import'));
const cwImportAllTask = new (require('./cw-import/cw-import-all'));
const plImportAllTask = new (require('./pl-import/pl-import-all'));
const allocationsImportTask = new (require('./pl-import/allocations-import'));

class ImportAllTask extends BaseTask{
    constructor(){
        super('import-all');
    }
    _doRun(){
        return skillsImportTask.run()
            .then(info => {
                return cwImportAllTask.run();
            })
            .then(info => {
                return plImportAllTask.run();
            })
            .then(info => {
                return allocationsImportTask.run();
            })
            .then(info => {
                return {message: 'Import all task finished ok'};
            });
    }
}

module.exports = ImportAllTask;