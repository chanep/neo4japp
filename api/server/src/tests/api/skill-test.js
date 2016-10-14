'use strict'
const _ = require('lodash');
const qs = require('qs');
const vows = require('vows');
const assert = require('assert'); 
const testHelper = require('../test-helper'); 

let req = null;
let sgs = null;
let skills = null;
let industries = null;


vows.describe('Skill api test')

.addBatch(testHelper.resetTestDbBatch())
.addBatch(testHelper.createBasicDataBatch(data => {sgs = data.skillGroups; skills = data.skills; industries = data.industries;}))

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
            var search = {
                type: ['skill', 'tool'],
                name: 's'
            };
            var queryString = qs.stringify(search, { encode: false });
            req.get('skill?' + queryString, this.callback);
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

.addBatch({
    '2b. Find Skills by term': {
        topic: function () {
           var search = {
                type: ['skill', 'tool'],
                name: 'ssdfgdfgdfg'
            };
            var queryString = qs.stringify(search, { encode: false });
            req.get('skill?' + queryString, this.callback);
        },
        'response is 200': testHelper.assertSuccess(),
        'should return skill groups full hierarchy': function (err, result, body) {
            if (err) {
                console.log("error", err);
                throw err;
            }
            let s = body.data;
            

            assert.equal(s.length, 0);
        }
    }
})

.addBatch({
    '3. Find Skills by type': {
        topic: function () {
            req.get('skill/by-group-type/industry', this.callback);
        },
        'response is 200': testHelper.assertSuccess(),
        'should return skill groups full hierarchy': function (err, result, body) {
            if (err) {
                console.log("error", err);
                throw err;
            }
            let ind = body.data;
            assert.isArray(ind);
            assert.equal(ind.length, industries.length);
        }
    }
})

.export(module);

