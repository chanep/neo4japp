'use strict'
const _ = require('lodash');
const vows = require('vows');
const assert = require('assert'); 
const testHelper = require('../test-helper'); 
const approverDa = new (require('../../data-access/approver'));

let req = null;
let data = null;


vows.describe('Search-all api test')

.addBatch(testHelper.resetTestDbBatch())
.addBatch(testHelper.createBasicDataBatch(d => data = d))
.addBatch(testHelper.loginBatch(r => req = r))

.addBatch({
    '1. Search all': {
        topic: function () {
            req.get('resource-manager/search-all?term=S&limit=3', 
                this.callback);
        },
        'response is 200': testHelper.assertSuccess(),
        'should return search all result': function (err, result, body) {
            if (err) {
                console.log("error", err);
                throw err;
            }

            let r = body.data;

            assertSearchAllResult(r);

            assert.equal(r.skills.length, 3);
            assert.equal(r.tools.length, 3);
            assert.equal(r.industries.length, 3);
            assert.equal(r.interests.length, 1);
            assert.equal(r.users.length, 3);
        }
    }
})

.addBatch({
    '2. Search all': {
        topic: function () {
            req.get('resource-manager/search-all?term=pepe&limit=3', 
                this.callback);
        },
        'response is 200': testHelper.assertSuccess(),
        'should return search all result ': function (err, result, body) {
            if (err) {
                console.log("error", err);
                throw err;
            }

            let r = body.data;
            assertSearchAllResult(r);

            assert.equal(r.skills.length, 0);
            assert.equal(r.tools.length, 0);
            assert.equal(r.industries.length, 0);
            assert.equal(r.interests.length, 0);
            assert.equal(r.users.length, 3);
        }
    }
})

.addBatch({
    '3. Search all': {
        topic: function () {
            req.get('resource-manager/search-all?term=s0&limit=3', 
                this.callback);
        },
        'response is 200': testHelper.assertSuccess(),
        'should return search all result ': function (err, result, body) {
            if (err) {
                console.log("error", err);
                throw err;
            }

            let r = body.data;
            assertSearchAllResult(r);

            assert.equal(r.skills.length, 0);
            assert.equal(r.tools.length, 1);
            assert.equal(r.industries.length, 0);
            assert.equal(r.interests.length, 0);
            assert.equal(r.users.length, 0);
        }
    }
})

.addBatch({
    '4. Search all': {
        topic: function () {
            req.get('resource-manager/search-all?term=dustr&limit=5', 
                this.callback);
        },
        'response is 200': testHelper.assertSuccess(),
        'should return search all result ': function (err, result, body) {
            if (err) {
                console.log("error", err);
                throw err;
            }

            let r = body.data;
            assertSearchAllResult(r);

            assert.equal(r.skills.length, 0);
            assert.equal(r.tools.length, 0);
            assert.equal(r.industries.length, 4);
            assert.equal(r.interests.length, 0);
            assert.equal(r.users.length, 0);
        }
    }
})

.addBatch({
    '5. Search all': {
        topic: function () {
            req.get('resource-manager/search-all?term=tennis&limit=3', 
                this.callback);
        },
        'response is 200': testHelper.assertSuccess(),
        'should return search all result ': function (err, result, body) {
            if (err) {
                console.log("error", err);
                throw err;
            }

            let r = body.data;
            assertSearchAllResult(r);

            assert.equal(r.skills.length, 0);
            assert.equal(r.tools.length, 0);
            assert.equal(r.industries.length, 0);
            assert.equal(r.interests.length, 1);
            assert.equal(r.users.length, 0);
        }
    }
})

.export(module);


function assertSearchAllResult(result){
    let r = result;
    assert.isArray(r.skills);
    assert.isArray(r.tools);
    assert.isArray(r.industries);
    assert.isArray(r.interests);
    assert.isArray(r.users);
    for(let s of r.skills){
        assert.isString(s.name);
    }
    for(let t of r.tools){
        assert.isString(t.name);
    }
    for(let i of r.industries){
        assert.isString(i.name);
    }
    for(let i of r.interests){
        assert.isString(i.name);
    }
    for(let u of r.users){
        assert.isString(u.fullname);
    }
}
