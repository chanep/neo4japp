'use strict'
const errors = require('../shared/errors');
const P = require('bluebird');
const BaseTask = require('./base-task');

class TaskImportTask extends BaseTask{
    constructor(){
        super('tasks-import');
    }

    _doRun(){
        return P.resolve("todo ok");
    }
}

module.exports = TaskImportTask;