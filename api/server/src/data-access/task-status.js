'use strict'
const BaseDa = require('./base-da');
const errors = require('../shared/errors');

class TaskStatusDa extends BaseDa{
    constructor(tx){
        super(tx, 'TaskStatus');
    }
    setRunning(taskName, info){
        let data = {
            name: taskName,
            status: "running",
            lastStart: new Date(),
            info: info
        };
        return this._upsert(data);
    }
    setFinishOk(taskName, info){
        let data = {
            name: taskName,
            status: "ok",
            lastFinish: new Date(),
            info: info
        };
        return this._upsert(data);
    }
    setFinishError(taskName, info){
        let data = {
            name: taskName,
            status: "error",
            lastFinish: new Date(),
            info: info
        };
        return this._upsert(data);
    }
    findByName(name){
        let query = {name: name};
        return this.find(query);
    }
    _upsert(data){
        let query = {name: taskname};
        return this.find(query)
            .then(tasks => {
                if(tasks.length == 0){
                    return this.create(data);
                } else{
                    data.id = tasks[0].id;
                    return this.update(data, true);
                }
            });
    }
}

module.exports = TaskStatusDa;