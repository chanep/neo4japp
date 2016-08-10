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
    '1. create employee': {
        topic: function () {
            employeeDa.create(employee)
                .then(r => this.callback(null, r))
                .catch(err => this.callback(err))
        },
        'should create employee': function (err, result) {
            if(err){
                throw err;
            }
            employee.id = result.id;
        }
    }
})

.addBatch({
    '2. create skillGroup': {
        topic: function () {
            skillGroupDa.create(skillGroup)
                .then(r => this.callback(null, r))
                .catch(err => this.callback(err))
        },
        'should create skill': function (err, result) {
            if(err){
                console.log("error", err)
                throw err;
            }
            skillGroup.id = result.id;
        }
    }
})

.addBatch({
    '3. create skill and relate with group': {
        topic: function () {
            skillDa.createAndRelate(skill, skillGroup.id, "group")
                .then(r => this.callback(null, r))
                .catch(err => this.callback(err))
        },
        'should create skill': function (err, result) {
            if(err){
                throw err;
            }
            skill.id = result.id;
        }
    }
})

.addBatch({
    '4. create knowledge': {
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
    '4. find employee and include knowledges and skill group': {
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

.export(module);