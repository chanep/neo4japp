'use strict'
const _ = require('lodash');
const async = require('async');
const errors = require('../shared/errors');
const config = require('../shared/config').googlespreadsheet;
const P = require('bluebird');
const BaseTask = require('./base-task');
const AllocationDa = require('../data-access/allocation');


class AllocationsImportTask extends BaseTask{
    constructor(){
        super('allocations-import');
    }

    _doRun(){
    	let _this = this;


    }
}

module.exports = AllocationsImportTask;