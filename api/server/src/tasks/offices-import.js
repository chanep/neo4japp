'use strict'
const errors = require('../shared/errors');
const P = require('bluebird');
const BaseTask = require('./base-task');

class OfficesImportTask extends BaseTask{
    constructor(){
        super('offices-import');
    }
    _doRun(){
        return P.resolve("todo ok");
    }
}

module.exports = OfficesImportTask;