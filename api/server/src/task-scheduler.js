'use strict'
require('dotenv').load();
var schedule = require('node-schedule');
var tasksConf = require('./task-config.json');

var taskName = process.argv[2];
if(taskName){
	runTask(taskName);
} else{
	setupSchedule();
}


function setupSchedule() {
	console.log("Task scheduler started...");
	tasksConf.forEach(function(taskConf) {
		var task = new (require(taskConf.path));
		var j = schedule.scheduleJob(taskConf.cronPattern, function() {
			task.run(taskConf.args);
		});
	})
}

function runTask(taskName){
	var taskConf = tasksConf.filter(function(t){
		return t.name == taskName;
	})[0];

	if(taskConf){
		var task = new (require(taskConf.path));
		task.run(taskConf.args);
	} else {
		console.log("Task " + taskName + " does not exist");
	}
}