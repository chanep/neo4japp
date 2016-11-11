'use strict'
const P = require('bluebird');
const config = require('../shared/config');
const errors = require('../shared/errors');
const BaseController = require('./base-controller');
const taskRunner = require('../services/task-runner');
const taskStatusDa = new (require('../data-access/task-status'));

class TaskController extends BaseController{

    /**
    @api {post} /api/admin/task/:taskName Run task
    @apiGroup Tasks
    */
    run(req, res, next){
        let taskName = req.params.taskName;
        let promise = taskRunner.runTask(taskName);

        this._respondPromise(req, res, promise);
    }

    /**
    @api {get} /api/admin/task Tasks Status
    @apiGroup Tasks
    */
    status(req, res, next){
        let promise = taskStatusDa.find();
        this._respondPromise(req, res, promise);
    }

} 

module.exports = TaskController;
