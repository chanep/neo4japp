'use strict'
const _ = require('lodash');
const vows = require('vows');
const assert = require('assert'); 
const testHelper = require('../test-helper'); 
const userDa = new (require('../../data-access/user'));
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

let user = {
    username: 'estebant',
    email: 'esteban.test@rga.com',
    fullname: 'Esteban Test',
    type: 'UserEmployee'
};

let user2 = {
    username: 'estebant2',
    email: 'esteban.test2@rga.com',
    fullname: 'Esteban Test2',
    type: 'UserEmployee'
};

let knowledges = [
    {
        level: 4,
        want: false
    },
    {
        level: 2,
        want: true
    },
    {
        level: 5,
        want: false
    }
];

vows.describe('User/Skill data access test')

.addBatch(testHelper.resetTestDbBatch())

.addBatch({
    '1. create skill group, skill and user': {
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
                    return userDa.create(user)
                })
                .then(u => {
                    user.id = u.id;
                    return userDa.create(user2)
                })
                .then(u => {
                    user2.id = u.id;
                })
                .then(r => this.callback(null, r))
                .catch(err => this.callback(err))
        },
        'should create user': function (err, result) {
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
            userDa.setKnowledge(user.id, skills[0].id, knowledges[0])
                .then(k => {
                    return userDa.setKnowledge(user.id, skills[2].id, knowledges[1])
                })
                .then(k => {
                    return userDa.setKnowledge(user2.id, skills[3].id, knowledges[2])
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
    '3. find user and include knowledges and skill group': {
        topic: function () {
            let include = {
                key : "knowledges",
                includes : ["group"]
            }
            userDa.findById(user.id, [include])
                .then(r => this.callback(null, r))
                .catch(err => this.callback(err))
        },
        'should crete knowledge': function (err, result) {
            if(err){
                console.log("error", err)
                throw err;
            }
            let u = result;
            assert.isArray(u.knowledges)
            u.knowledges.forEach(k => {
                assert.isTrue(!!k.skill)
                assert.isTrue(!!k.skill.group)
            })
        }
    }
})

.addBatch({
    '4. find users with suqueries': {
        topic: function () {
            let query = {
                username: user.username,
                includes: [{
                    key: "knowledges",
                    relQuery: {level: {$gt: 3}},
                    includes: ["group"]
                }]
            };
            userDa.find(query)
                .then(r => this.callback(null, r))
                .catch(err => this.callback(err))
        },
        'should crete knowledge': function (err, result) {
            if(err){
                console.log("error", err)
                throw err;
            }
            assert.equal(result.length, 1)
            result.forEach(u =>{
                assert.isArray(u.knowledges)
                u.knowledges.forEach(k => {
                    assert.isTrue(k.level > 3);
                })
            })
        }
    }
})

.addBatch({
    '4b. find users with suqueries': {
        topic: function () {
            let query = {
                username: user.username,
                includes: [{
                    key: "knowledges",
                    relQuery: {level: {$lt: 3}},
                    includes: ["group"]
                }]
            };
            userDa.find(query)
                .then(r => this.callback(null, r))
                .catch(err => this.callback(err))
        },
        'should crete knowledge': function (err, result) {
            if(err){
                console.log("error", err)
                throw err;
            }
            assert.equal(result.length, 1)
            result.forEach(u =>{
                assert.isArray(u.knowledges)
                u.knowledges.forEach(k => {
                    assert.isTrue(k.level < 3);
                })
            })
        }
    }
})

.addBatch({
    '4c. find users with suqueries': {
        topic: function () {
            let query = {
                username: user.username,
                includes: [{
                    key: "knowledges",
                    includes: [
                        {key: "group", query: {type: skillGroups[1].type}}
                    ]
                }]
            };
            userDa.find(query)
                .then(r => this.callback(null, r))
                .catch(err => this.callback(err))
        },
        'should crete knowledge': function (err, result) {
            if(err){
                console.log("error", err)
                throw err;
            }
            assert.equal(result.length, 1)
            let u = result[0];

            assert.equal(u.knowledges.length, 1)
            u.knowledges.forEach(k => {
                assert.equal(k.skill.group.type, skillGroups[1].type);
            })
        }
    }
})

.addBatch({
    '4d. find users with suqueries with notInclude': {
        topic: function () {
            let query = {
                username: user.username,
                includes: [{
                    key: "knowledges",
                    notInclude: true,
                    relQuery: {level: {$lt: 3}},
                    includes: ["group"]
                }]
            };
            userDa.find(query)
                .then(r => this.callback(null, r))
                .catch(err => this.callback(err))
        },
        'should crete knowledge': function (err, result) {
            if(err){
                console.log("error", err)
                throw err;
            }
            assert.equal(result.length, 1)
            let u = result[0];

            assert.isUndefined(u.knowledges);

        }
    }
})

.addBatch({
    '5. find users order by': {
        topic: function () {
            let query = {
                includes: [{
                    key: "knowledges",
                    includes: ["group"]
                }],
                orderBy: "username ASC"
            };
            userDa.find(query)
                .then(r => this.callback(null, r))
                .catch(err => this.callback(err))
        },
        'should crete knowledge': function (err, result) {
            if(err){
                console.log("error", err)
                throw err;
            }
            assert.equal(result.length, 2)
            let u = result[0];
            console.log("result", JSON.stringify(result))
        }
    }
})

.addBatch({
    '5b. find users order by': {
        topic: function () {
            let query = {
                includes: ["group"],
                orderBy: "group.name DESC"
            };
            skillDa.find(query)
                .then(r => this.callback(null, r))
                .catch(err => this.callback(err))
        },
        'should crete knowledge': function (err, result) {
            if(err){
                console.log("error", err)
                throw err;
            }

            console.log("result", JSON.stringify(result))
        }
    }
})

.addBatch({
    '6. count users': {
        topic: function () {
            let query = {
                username: user.username
            };
            userDa.count(query)
                .then(r => this.callback(null, r))
                .catch(err => this.callback(err))
        },
        'should crete knowledge': function (err, result) {
            if(err){
                console.log("error", err)
                throw err;
            }

            assert.equal(result, 1)
        }
    }
})


.addBatch({
    '6b. count users': {
        topic: function () {
            let query = {
                username: user.username + 'x'
            };
            userDa.count(query)
                .then(r => this.callback(null, r))
                .catch(err => this.callback(err))
        },
        'should crete knowledge': function (err, result) {
            if(err){
                console.log("error", err)
                throw err;
            }

            assert.equal(result, 0)
        }
    }
})

.export(module);