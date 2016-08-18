'use strict'
require('dotenv').load();
const schedule = require('node-schedule');
const tasksConf = require('./task-config.json');

let taskName = process.argv[2];
if(taskName){
	runTask(taskName);
} else{
	setupSchedule();
}


function setupSchedule() {
	console.log("Task scheduler started...");
	tasksConf.forEach(function(taskConf) {
		if(taskConf.cronPattern){
			let task = new (require(taskConf.path));
			let j = schedule.scheduleJob(taskConf.cronPattern, function() {
				run(task, taskConf.args);
			});
		}
	})
}

function runTask(taskName){
	var taskConf = tasksConf.filter(function(t){
		return t.name == taskName;
	})[0];

	if(taskConf){
		var task = new (require(taskConf.path));
		run(task, taskConf.args);
	} else {
		console.log("Task " + taskName + " does not exist");
	}
}

function run(task, args){
	console.log(`Task ${task.name} started...`);
	task.run(args)
		.then(info => console.log(`Task ${task.name} finished ok. Info: ${JSON.stringify(info)}`))
		.catch(err => console.log(`Task ${task.name} finished with error`, err));
}
