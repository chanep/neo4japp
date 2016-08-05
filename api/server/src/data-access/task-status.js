'use strict'
const _ = require('lodash');
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
            lastStart: Date(),
            info: info
        };
        return this._upsert(data);
    }
    setFinishOk(taskName, info){
        let data = {
            name: taskName,
            status: "ok",
            lastFinish: Date(),
            info: info
        };
        return this._upsert(data);
    }
    setFinishError(taskName, info){
        let data = {
            name: taskName,
            status: "error",
            lastFinish: Date(),
            info: info
        };
        return this._upsert(data);
    }
    findByName(name){
        let query = {name: name};
        return this.find(query);
    }
    _toEntity(node){
        let entity = _.clone(node);
        if(node.info)
            entity.info = JSON.parse(entity.info);
        if(node.lastFinish)
            entity.lastFinish = new Date(node.lastFinish);
        if(node.lastStart)
            entity.lastStart = new Date(node.lastStart);
        return entity;
    }
    _toNode(entity){
        let node = _.clone(entity);
        if(entity.info){
            node.info = JSON.stringify(entity.info);
        }
        return node;
    }
    _upsert(data){
        let query = {name: data.name};
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