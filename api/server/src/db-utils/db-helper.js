'use strict'
let path = require('path');
const P = require('bluebird');
const async = require('async')
const fs = require("fs");
const config = require('../shared/config');
const db = require('../data-access/db');
const AppSettingDa = require('../data-access/app-setting');
const dbVersionSettingName = 'db_version';

const scriptsDir = path.resolve(__dirname, "./scripts");


let pfs = {
    readdir: P.promisify(fs.readdir),
    readFile: P.promisify(fs.readFile)
};
let asyncEachSeries = P.promisify(async.eachSeries);

module.exports = {
    applyScripts: applyScripts,
    deleteLabels: deleteLabels,
    closeDb: closeDb
}


function closeDb(){
    db.close();
}

function deleteLabels(labels){
    if(!Array.isArray(labels))
        labels = [labels];
    return asyncEachSeries(labels, function (label, callback) {           
        deleteLabel(label)
            .then(() => {
                callback();
            })
            .catch(err =>{
                callback(err);
            });
    });
}

function deleteLabel(label){
    let cypher = `match (n:${label}) optional match (n)-[r]-() delete r, n`;
    return runCommand(cypher);
}

function runCommand(cypher){
    let session = db.session();
    return session.run(cypher)
        .then(r => {
            session.close();
            return r;
        });
}

function applyScripts(partitionSuffix){
    let dbVersion;
    let scriptsApplied = 0;
    return getCurrentDbVersion()
    .then(version => {
        dbVersion = version;
        console.log('Using partition suffix: ' + partitionSuffix);
        console.log('Current dbVersion: ' + dbVersion);
        return getUnappliedScripts(dbVersion);
    })
    .then(scripts => {
        console.log(scripts.length + ' scripts to apply...');
        return asyncEachSeries(scripts, function (s, callback) {           
            runScript(s, dbVersion + 1, partitionSuffix)
                .then(() => {
                    scriptsApplied++;
                    dbVersion++;
                    console.log(s + ' applied');
                    callback();
                })
                .catch(err =>{
                    console.log('error applying script ' + s);
                    console.log(err);
                    callback(err);
                });
        })
    })
    .finally(() => {
        console.log(scriptsApplied + ' scripts applied.');
        console.log('Db Version is: ' + dbVersion);
        //db.close();
    });
}

function getCurrentDbVersion(){
    let appSettingDa = new AppSettingDa();
    return appSettingDa.get(dbVersionSettingName)
        .then(dbVersion => {
            if(!dbVersion)
                return 0;
            return Number(dbVersion);
        });
}

function runScript(filename, dbVersion, partitionSuffix){
    return readScript(filename)
        .then(cypher => {
            cypher = setPartition(cypher, partitionSuffix);
            let cypherArray = cypher.split(';');
            cypherArray = cypherArray.filter(c =>{
                return !!(c.match(/\w/));
            });
            return runCypherArrayTx(cypherArray, dbVersion);
        });
}

function runCypherArrayTx(cypherArray, dbVersion){
    let tx = db.beginTransaction();
    let appSettingDa = new AppSettingDa();
    return runCypherArray(cypherArray, tx)
        .then(() =>{
            return tx.commit();
        })
        .then(() => {
            return appSettingDa.set(dbVersionSettingName, dbVersion);
        })
        .catch(err => {
            tx.rollback();
            throw err;
        });
}

function runCypherArray(cypherArray, tx) {
    return asyncEachSeries(cypherArray, function (c, callback) {
        tx.run(c)
            .then(() => {
                callback();
            })
            .catch(err => {
                callback(err);
            })
    });
}

function scriptNumber(filename){
    return Number(filename.split('.')[0])
}

function readScript(filename){
    let scriptPath = path.resolve(scriptsDir, "./" + filename);
    return pfs.readFile(scriptPath, 'utf8');
}

function setPartition(cypher, partitionSuffix){
    return cypher.replace(/\$\{p\}/g, partitionSuffix);
}

function getUnappliedScripts(dbVersion){
    dbVersion = dbVersion || 0;
    return pfs.readdir(scriptsDir)
        .then(scripts => {
            scripts = scripts.filter(s => {
                return s.endsWith('.cql');
            });
            scripts = scripts.sort();
            scripts = scripts.filter(s => {
                let sNumber = Number(s.split('.')[0])
                return (sNumber > dbVersion);
            }); 
            return scripts;
        })
}