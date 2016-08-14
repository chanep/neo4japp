
'use strict'
let path = require('path');
let envFile = path.resolve(__dirname, "../.env");
require('dotenv').config({path: envFile});
const config = require('../shared/config');
const dbHelper = require('./db-helper');


let p = getPartition();
dbHelper.applyScripts(p)
    .finally(() => {
        dbHelper.closeDb();
    })

function getPartitionSuffix(){
    if(process.argv[2]){
        return process.argv[2];
    }
    return config.db.partitionSuffix;
}


