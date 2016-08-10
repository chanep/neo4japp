'use strict'
const _ = require('lodash');
const vows = require('vows');
const assert = require('assert'); 
const testHelper = require('./test-helper'); 
const taskStatusDa = new (require('../../data-access/task-status'));




let taskname = 'task1';
let info = {
    k1: "v1",
    k2: "v2"
};


vows.describe('Task Status data access test')

.addBatch({
    '1. delete all task status': {
        topic: function () {
            taskStatusDa.deleteAll()
                .then(r => this.callback(null, r))
                .catch(err => this.callback(err))
        },
        'should delete all taskStatus': function (err, result) {
            if(err){
                throw err;
            }
                
            
        }
    }
})

.addBatch({
    '2. set taskStatus to running': {
        topic: function () {
            taskStatusDa.setRunning(taskname, info)
                .then(r => this.callback(null, r))
                .catch(err => this.callback(err))
        },
        'skill group created': function (err, result) {
            if(err){
                throw err;
            }
        }
    }
})

.addBatch({
    '3. find task by name': {
        topic: function () {
            taskStatusDa.findByName(taskname)
                .then(r => this.callback(null, r))
                .catch(err => this.callback(err))
        },
        'should find taskStatus': function (err, result) {
            if(err){
                throw err;
            }
            assert.isNotNull(result);
            assert.equal(result.name, taskname);
            assert.equal(result.status, "running");
            assert.deepEqual(result.info, info);
            assert.isTrue(_.isDate(result.lastStart));
        }
    }
})

.addBatch({
    '4. set taskStatus to finished ok': {
        topic: function () {
            taskStatusDa.setFinishOk(taskname, info)
                .then(r => this.callback(null, r))
                .catch(err => this.callback(err))
        },
        'skill group created': function (err, result) {
            if(err){
                throw err;
            }
        }
    }
})

.addBatch({
    '5. find task by name': {
        topic: function () {
            taskStatusDa.findByName(taskname)
                .then(r => this.callback(null, r))
                .catch(err => this.callback(err))
        },
        'should find taskStatus': function (err, result) {
            if(err){
                throw err;
            }
            assert.isNotNull(result);
            assert.equal(result.name, taskname);
            assert.equal(result.status, "ok");
            assert.deepEqual(result.info, info);
            assert.isTrue(_.isDate(result.lastFinish));
        }
    }
})

.addBatch({
    '4. set taskStatus to finished error': {
        topic: function () {
            taskStatusDa.setFinishError(taskname, info)
                .then(r => this.callback(null, r))
                .catch(err => this.callback(err))
        },
        'skill group created': function (err, result) {
            if(err){
                throw err;
            }
        }
    }
})

.addBatch({
    '5. find task by name': {
        topic: function () {
            taskStatusDa.findByName(taskname)
                .then(r => this.callback(null, r))
                .catch(err => this.callback(err))
        },
        'should find taskStatus': function (err, result) {
            if(err){
                throw err;
            }
            assert.isNotNull(result);
            assert.equal(result.name, taskname);
            assert.equal(result.status, "error");
            assert.deepEqual(result.info, info);
            assert.isTrue(_.isDate(result.lastFinish));
        }
    }
})


.export(module);