'use strict'
const errors = require('../shared/errors');
const P = require('bluebird');
const TaskStatusDa = require('../data-access/task-status');

class BaseTask {
    constructor(name){
        this.name = name;
    }
    _doRun(args){
        return P.reject(new errors.GenericError("Task must override _doRun"));
    }
    run(args){
        let taskStatusDa = new TaskStatusDa();
        taskStatusDa.findByName(this.name)
            .then(taskStatus => {
                if(taskStatus && taskStatus.status == 'running'){
				    throw new errors.GenericError("task is already running...");
                } else{
                    return taskStatusDa.setRunning(this.name);
                }
            })
            .then(() => {
                return this._doRun(args);
            })
            .then(info => {
                console.log(`Task ${this.name} finished ok`);
			    return taskStatusDa.setFinishOk(taskName, info);
            })
            .catch(info => {
                console.log(`Task ${this.name} finished with error`);
			    return taskStatusDa.setFinishError(taskName, info);
            })
    }
}

module.exports = BaseTask;