'use strict'
const _ = require('lodash');
const vows = require('vows');
const assert = require('assert'); 
const testHelper = require('../test-helper'); 
const employeeDa = new (require('../../data-access/employee'));
const skillDa = new (require('../../data-access/skill'));
const skillGroupDa = new (require('../../data-access/skill-group'));

let skillGroup = {
    name: 'languages',
    type: 'tool'
}

let skill = {
    name: 'php'
}

let employee = {
    username: 'estebant',
    email: 'esteban.test@rga.com',
    fullname: 'Esteban Test',
};

let knowledge = {
    level: 4,
    want: false
};

vows.describe('Employee/Skill data access test')

.addBatch(testHelper.resetTestDbBatch())

.addBatch({
    '1. create skill group, skill and employee': {
        topic: function () {
            skillGroupDa.create(skillGroup)
                .then(sg => {
                    skillGroup.id = sg.id;
                    return skillDa.createAndRelate(skill, skillGroup.id, "group");
                })
                .then(s => {
                    skill.id = s.id;
                    return employeeDa.create(employee)
                })
                .then(r => this.callback(null, r))
                .catch(err => this.callback(err))
        },
        'should create employee': function (err, result) {
            if(err){
                console.log("error", err)
                throw err;
            }
            employee.id = result.id;
        }
    }
})

.addBatch({
    '2. create knowledge': {
        topic: function () {
            employeeDa.setKnowledge(employee.id, skill.id, knowledge)
                .then(r => this.callback(null, r))
                .catch(err => this.callback(err))
        },
        'should crete knowledge': function (err, result) {
            if(err){
                console.log("error", err)
                throw err;
            }
            console.log("knowledge", result)
        }
    }
})

.addBatch({
    '3. find employee and include knowledges and skill group': {
        topic: function () {
            let include = {
                key : "knowledges",
                includes : ["group"]
            }
            employeeDa.findById(employee.id, [include])
                .then(r => this.callback(null, r))
                .catch(err => this.callback(err))
        },
        'should crete knowledge': function (err, result) {
            if(err){
                console.log("error", err)
                throw err;
            }
            console.log("employee", JSON.stringify(result))
        }
    }
})

.addBatch({
    '4. find employees with suqueries': {
        topic: function () {
            let query = {
                username: employee.username,
                includes: [{
                    key: "knowledges",
                    relQuery: {level: {$gt: 3}},
                    includes: ["group"]
                }]
            };
            employeeDa.find(query)
                .then(r => this.callback(null, r))
                .catch(err => this.callback(err))
        },
        'should crete knowledge': function (err, result) {
            if(err){
                console.log("error", err)
                throw err;
            }
            assert.equal(result.length, 1)
            console.log("employee", JSON.stringify(result))
        }
    }
})

.addBatch({
    '4b. find employees with suqueries': {
        topic: function () {
            let query = {
                username: employee.username,
                includes: [{
                    key: "knowledges",
                    relQuery: {level: {$lt: 3}},
                    includes: ["group"]
                }]
            };
            employeeDa.find(query)
                .then(r => this.callback(null, r))
                .catch(err => this.callback(err))
        },
        'should crete knowledge': function (err, result) {
            if(err){
                console.log("error", err)
                throw err;
            }
            assert.equal(result.length, 0)
        }
    }
})

.export(module);