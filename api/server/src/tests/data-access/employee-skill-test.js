'use strict'
const _ = require('lodash');
const vows = require('vows');
const assert = require('assert'); 
const testHelper = require('../test-helper'); 
const employeeDa = new (require('../../data-access/employee'));
const skillDa = new (require('../../data-access/skill'));
const skillGroupDa = new (require('../../data-access/skill-group'));

let skillGroups = [
    {
        name: 'languages',
        type: 'tool'
    },
    {
        name: 'design',
        type: 'skill'
    }
];

let skills = [{name: 's1'}, {name: 's2'}, {name: 's3'}, {name: 's4'}];

let employee = {
    username: 'estebant',
    email: 'esteban.test@rga.com',
    fullname: 'Esteban Test',
    type: 'EmployeeUser'
};

let knowledges = [
    {
        level: 4,
        want: false
    },
    {
        level: 2,
        want: true
    }
];

vows.describe('Employee/Skill data access test')

.addBatch(testHelper.resetTestDbBatch())

.addBatch({
    '1. create skill group, skill and employee': {
        topic: function () {
            skillGroupDa.create(skillGroups[0])
                .then(sg => {
                    skillGroups[0].id = sg.id;
                    return skillGroupDa.create(skillGroups[1]);
                })
                .then(sg => {
                    skillGroups[1].id = sg.id;
                    return skillDa.createAndRelate(skills[0], skillGroups[0].id, "group");
                })
                .then(s => {
                    skills[0].id = s.id;
                    return skillDa.createAndRelate(skills[1], skillGroups[0].id, "group");
                })
                .then(s => {
                    skills[1].id = s.id;
                    return skillDa.createAndRelate(skills[2], skillGroups[1].id, "group");
                })
                .then(s => {
                    skills[2].id = s.id;
                    return skillDa.createAndRelate(skills[3], skillGroups[1].id, "group");
                })
                .then(s => {
                    skills[3].id = s.id;
                    return employeeDa.create(employee)
                })
                .then(e => {
                    employee.id = e.id;
                })
                .then(r => this.callback(null, r))
                .catch(err => this.callback(err))
        },
        'should create employee': function (err, result) {
            if(err){
                console.log("error", err)
                throw err;
            }
        }
    }
})

.addBatch({
    '2. create knowledges': {
        topic: function () {
            employeeDa.setKnowledge(employee.id, skills[0].id, knowledges[0])
                .then(k => {
                    return employeeDa.setKnowledge(employee.id, skills[2].id, knowledges[1])
                })
                .then(r => this.callback(null, r))
                .catch(err => this.callback(err))
        },
        'should crete knowledge': function (err, result) {
            if(err){
                console.log("error", err)
                throw err;
            }
            console.log("knowledges", result)
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
            let e = result[0];
            assert.equal(e.knowledges.length, 1)
            e.knowledges.forEach(k => {
                assert.isTrue(k.level > 3);
            })
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
            assert.equal(result.length, 1)
            let e = result[0];
            assert.equal(e.knowledges.length, 1)
            e.knowledges.forEach(k => {
                assert.isTrue(k.level < 3);
            })
        }
    }
})

.addBatch({
    '4c. find employees with suqueries': {
        topic: function () {
            let query = {
                username: employee.username,
                includes: [{
                    key: "knowledges",
                    includes: [
                        {key: "group", query: {type: skillGroups[1].type}}
                    ]
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
            let e = result[0];

            assert.equal(e.knowledges.length, 1)
            e.knowledges.forEach(k => {
                assert.equal(k.skill.group.type, skillGroups[1].type);
            })
        }
    }
})

.export(module);