'use strict'
const BaseDa = require('./base-da');

class TaskStatusDa extends BaseDa{
    constructor(){
        super('TaskStatus');
    }
    save(data){
        return this._validate(data, schema)
            .then(data => {
                return super.save(data);
            });
    }
    setRunning(taskName, info){
        let data = {
            name: taskName,
            status: "running",
            lastStart: new Date(),
            info: info
        };

        var promise = Lookup.upsert(lookup);
		return this._wrapPromise(promise);
    }
}

module.exports = SkillGroupDa;



var TaskStatusService = BaseService.extend({

    setRunning: function(taskName, info){
        var _this = this;
        var lookup = {
            group: group,
            code: taskName,
            data: {
                code: taskName,
                status: "running",
                lastStart: new Date(),
                info: info
            }
        }

        var promise = Lookup.upsert(lookup);
		return this._wrapPromise(promise);
    },

    setFinishOk: function(taskName, info){
        var _this = this;
        var lookup = {
            group: group,
            code: taskName,
            data: {
                code: taskName,
                status: "ok",
                lastFinish: new Date(),
                info: info
            }
        }

        return _this.getByTaskName(taskName)
            .then(function(taskStatus){
                if(taskStatus && taskStatus.status == 'running'){
                    lookup.data.lastStart = taskStatus.lastStart;
                }
                _this._wrapPromise(Lookup.upsert(lookup));
            });
    },

    setFinishError: function(taskName, info){
        var _this = this;
        var lookup = {
            group: group,
            code: taskName,
            data: {
                code: taskName,
                status: "error",
                lastFinish: new Date(),
                info: info
            }
        }

        return _this.getByTaskName(taskName)
            .then(function(taskStatus){
                if(taskStatus && taskStatus.status == 'running'){
                    lookup.data.lastStart = taskStatus.lastStart;
                }
                _this._wrapPromise(Lookup.upsert(lookup));
            });
    },


    getByTaskName: function(taskName){    
        var promise = Lookup.findOne({where: {group: group, code: taskName}})
            .then(function(lookup){
                if(lookup){
                    return lookup.toEntity();
                }
                return null;
            });
        return this._wrapPromise(promise);
    },

    list: function(){    
        var promise = Lookup.findAll({where: {group: group}})
            .then(function(lookups){
                return lookups.map(function(lookup){
                    return lookup.toEntity();
                });
            });
        return this._wrapPromise(promise);
    }
});


module.exports = new TaskStatusService();