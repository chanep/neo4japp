'use strict'
let test = (process.argv[2] == 'test');
if (test) {
    let path = require('path');
    let envFile = path.resolve(__dirname, "../.test-env");
    require('dotenv').config({ path: envFile });
} else {
    require('dotenv').load();
}

const P = require('bluebird');
const taskStatusDa = new (require('../data-access/task-status'));
const db = require('../data-access/db');

taskStatusDa.find({status: "running"})
    .then(tss => {
        let promises = [];
        for(let ts of tss){
            ts.status = "aborted";
            promises.push(taskStatusDa.update(ts));
        }
        return P.all(promises);
    })
    .catch(err =>{
        console.log(err);
    })
    .finally(() =>{
        db.close();
    })