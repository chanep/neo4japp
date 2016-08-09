'use strict'
const _ = require('lodash');
const vows = require('vows');
const assert = require('assert'); 
const testHelper = require('./test-helper'); 
const skillDa = new (require('../../data-access/skill'));
const skillGroupDa = new (require('../../data-access/skill-group'));



let skillData = {
    name: 'php'
};

let skillGroupData = {
    name: 'languages',
    type: 'skill'
};


vows.describe('Skill data access test')

.addBatch({
    '1. delete all skills': {
        topic: function () {
            skillDa.deleteAll()
                .then(r => this.callback(null, r))
                .catch(err => this.callback(err))
        },
        'skills deleted': function (err, result) {
            if(err){
                console.log("error", err);
            } else{
                console.log("result", JSON.stringify(result))
            }
                
            
        }
    }
})

.addBatch({
    '2. delete all skillGroups': {
        topic: function () {
            skillGroupDa.deleteAll()
                .then(r => this.callback(null, r))
                .catch(err => this.callback(err))
        },
        'skill groups deleted': function (err, result) {
            if(err){
                console.log("error", err);
                return;
            }
            
            console.log("result", result)
        }
    }
})

.addBatch({
    '3. create skill group': {
        topic: function () {
            skillGroupDa.create(skillGroupData)
                .then(r => this.callback(null, r))
                .catch(err => this.callback(err))
        },
        'skill group created': function (err, result) {
            if (err) {
                console.log("error", err);
                return;
            }
            assert.isNumber(result.id);
            skillGroupData.id = result.id;
        }
    }
})

.addBatch({
    '4. create skill and relate with skill group': {
        topic: function () {
            skillDa.createAndRelate(skillData, skillGroupData.id)
                .then(r => this.callback(null, r))
                .catch(err => this.callback(err))
        },
        'skill created': function (err, result) {
            if (err) {
                console.log("error", err);
                return;
            }
            assert.isNumber(result.id);
            skillData.id = result.id;
        }
    }
})

.addBatch({
    '5. find skill by id': {
        topic: function () {
            skillDa.findById(skillData.id, ["group"])
                .then(r => this.callback(null, r))
                .catch(err => this.callback(err))
        },
        'should find skill': function (err, result) {
            if (err) {
                console.error("error", err);
                return;
            }
            assert.isNotNull(result);
            assert.equal(result.name, skillData.name);
            assert.isTrue(!!result.group);
            assert.equal(result.group.name, skillGroupData.name);
        }
    }
})

.addBatch({
    '6. find skill with group included': {
        topic: function () {
            let query = {
                name: 'php',
                includes: ["group"]
            }
            skillDa.find(query)
                .then(r => this.callback(null, r))
                .catch(err => this.callback(err))
        },
        'should find skill': function (err, result) {
            if (err) {
                console.error("error", err);
                return;
            }
            console.error("result", result);
            assert.isArray(result);
            assert.equal(result.length, 1);
            assert.isTrue(!!result[0].group);
            assert.equal(result[0].name, skillData.name);
            assert.equal(result[0].group.name, skillGroupData.name);
        }
    }
})


.export(module);