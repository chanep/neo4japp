'use strict'
require('dotenv').load();
const P = require('bluebird');
const errors = require('../shared/errors');
const schedule = require('node-schedule');
const db = require('../data-access/db');
const tasksConf = require('../task-config.json');

module.exports = {
    scheduleTasks: scheduleTasks,
    runTask: runTask
};


function scheduleTasks() {
	console.log("Task scheduler started...");
	tasksConf.forEach(function(taskConf) {
		if(taskConf.cronPattern){
			let task = new (require("../" + taskConf.path));
			let j = schedule.scheduleJob(taskConf.cronPattern, function() {
				run(task, taskConf.args);
			});
		}
	})
}

function runTask(taskName, closeDb){
	var taskConf = tasksConf.filter(function(t){
		return t.name == taskName;
	});

	try {
		taskConf = taskConf[0];
		var task = new (require("../" + taskConf.path));
		run(task, taskConf.args)
			.finally(() => {
				if(closeDb)
					db.close();
			});
		return P.resolve(`Task ${taskName} started...`);
	} catch(error) {
		const e = new errors.BadRequestError(`Task ${taskName} not found`, error);
		return P.reject(e);
	}
}

function run(task, args){
	return task.run(args);
}