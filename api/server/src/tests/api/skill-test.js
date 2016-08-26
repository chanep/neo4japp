'use strict'
const _ = require('lodash');
const vows = require('vows');
const assert = require('assert'); 
const testHelper = require('../test-helper'); 

let req = null;
let user = null;
let sgs = null;
let skills = null;


vows.describe('Skill api test')

.addBatch(testHelper.resetTestDbBatch())
.addBatch(testHelper.createUserBatch(u => user = u))
.addBatch(testHelper.createSkillGroupsBatch(data => {sgs = data.skillGroups; skills = data.skills;}))

.addBatch(testHelper.loginBatch(r => req = r))
.addBatch({
    '1. Find All Skill Groups': {
        topic: function () {
            req.get('skill/all-groups', this.callback);
        },
        'response is 200': testHelper.assertSuccess(),
        'should return skill groups full hierarchy': function (err, result, body) {
            if (err) {
                console.log("error", err);
                throw err;
            }
            let groups = body.data;
            assert.equal(groups.length, sgs.length);
            assert.isArray(groups[0].children)
            assert.equal(groups[0].children.length, sgs[0].children.length);
            assert.isArray(groups[0].children[0].skills)
        }
    }
})
.addBatch({
    '2. Find Skills by term': {
        topic: function () {
            req.get('skill?name=s', this.callback);
        },
        'response is 200': testHelper.assertSuccess(),
        'should return skill groups full hierarchy': function (err, result, body) {
            if (err) {
                console.log("error", err);
                throw err;
            }
            let s = body.data;


            assert.equal(s.length, skills.length);
        }
    }
})

.addBatch({
    '2b. Find Skills by term': {
        topic: function () {
            req.get('skill?name=s', this.callback);
        },
        'response is 200': testHelper.assertSuccess(),
        'should return skill groups full hierarchy': function (err, result, body) {
            if (err) {
                console.log("error", err);
                throw err;
            }
            let s = body.data;
            

            assert.equal(s.length, skills.length);
            for(let skill of s){
                assert.isTrue(skill.name.indexOf('s') >= 0)
            }
        }
    }
})

.export(module);

