'use strict'
const errors = require('../shared/errors');
const P = require('bluebird');
const TaskStatusDa = require('../data-access/task-status');

class BaseTask {
    constructor(name){
        if(!name)
            throw new errors.GenericError("Must call BaseTasl constructor with task name argument");
        this.name = name;
    }
    _doRun(args){
        return P.reject(new errors.GenericError("Task must override _doRun"));
    }
    run(args){
        let running = false;
        let taskStatusDa = new TaskStatusDa();
        return taskStatusDa.findByName(this.name)
            .then(taskStatus => {
                if(taskStatus && taskStatus.status == 'running'){
                    running = true;
				    throw new errors.GenericError("task is already running...");
                } else{
                    return taskStatusDa.setRunning(this.name);
                }
            })
            .then(() => {
                return this._doRun(args);
            })
            .then(info => {
			    return taskStatusDa.setFinishOk(this.name, info)
                    .then(() => {
                        return info;
                    });
            })
            .catch(error => {
                if(!running){
                    let info = error;
                    if(typeof error == 'Error'){
                        info = {error: error.message};
                    }
                    return taskStatusDa.setFinishError(this.name, info)
                        .then(() => {
                            throw error;
                        });
                } else {
                    return P.reject(new errors.GenericError(`Task ${this.name} is already running...`))
                }
            })
    }
}

module.exports = BaseTask;