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
        let running = false;
        let taskStatusDa = new TaskStatusDa();
        taskStatusDa.findByName(this.name)
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
                console.log(`Task ${this.name} finished ok`);
			    return taskStatusDa.setFinishOk(this.name, info);
            })
            .catch(error => {
                let info = error;
                if(typeof error == 'Error'){
                    info = {error: error.message};
                }
                if(!running){
                    console.log(`Task ${this.name} finished with error`, error);
                    return taskStatusDa.setFinishError(this.name, info);
                }
            })
    }
}

module.exports = BaseTask;