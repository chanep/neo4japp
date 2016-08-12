'use strict'
const _ = require('lodash');
const BaseDa = require('./base-da');
const model = require('../models/models').taskStatus;
const errors = require('../shared/errors');

class TaskStatusDa extends BaseDa{
    constructor(tx){
        super(model, tx);
    }
    setRunning(taskName, info){
        let data = {
            name: taskName,
            status: "running",
            lastStart: new Date(),
            info: info
        };
        return this.upsert(data, ["name"]);
    }
    setFinishOk(taskName, info){
        let data = {
            name: taskName,
            status: "ok",
            lastFinish: new Date(),
            info: info
        };
        return this.upsert(data, ["name"]);
    }
    setFinishError(taskName, info){
        let data = {
            name: taskName,
            status: "error",
            lastFinish: new Date(),
            info: info
        };
        return this.upsert(data, ["name"]);
    }
    findByName(name){
        let query = {name: name};
        return this.findOne(query);
    }
}

module.exports = TaskStatusDa;