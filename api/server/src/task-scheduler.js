'use strict'
require('dotenv').load();
const taskRunner = require('./services/task-runner');

let taskName = process.argv[2];
if(taskName){
	const closeDb = true;
	taskRunner.runTask(taskName, closeDb)
		.catch(error => {
			console.log(error);
		});
} else{
	taskRunner.scheduleTasks();
}
