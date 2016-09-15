'use strict'
const _ = require('lodash');
const vows = require('vows');
const assert = require('assert'); 
const testHelper = require('../test-helper'); 

let req = null;
let user = null;

let interests = [
        {name: "Football"},
        {name: "Chess"}
    ];


vows.describe('Interest api test')

.addBatch(testHelper.resetTestDbBatch())
.addBatch(testHelper.createUserBatch(u => user = u))

.addBatch(testHelper.loginBatch(r => req = r, () => user.username))
.addBatch({
    '1. Add Interest': {
        topic: function () {
            req.put('user/interest', 
                {body: {interestName: interests[0].name}},
                this.callback);
        },
        'response is 200': testHelper.assertSuccess(),
        'should return interest ': function (err, result, body) {
            if (err) {
                console.log("error", err);
                throw err;
            }
            let i = body.data;
            assert.isNumber(i.id)
            assert.equal(i.name, interests[0].name)
            
            interests[0] = i;
        }
    }
})

.addBatch({
    '2. Add an other Interest': {
        topic: function () {
            req.put('user/interest', 
                {body: {interestName: interests[1].name}},
                this.callback);
        },
        'response is 200': testHelper.assertSuccess(),
        'should return interest ': function (err, result, body) {
            if (err) {
                console.log("error", err);
                throw err;
            }
            let i = body.data;
            assert.isNumber(i.id)
            assert.equal(i.name, interests[1].name)
            
            interests[1] = i;
        }
    }
})

.addBatch({
    '3. Find Interest by name': {
        topic: function () {
            req.get('interest?name=otbal', this.callback);
        },
        'response is 200': testHelper.assertSuccess(),
        'should return interest ': function (err, result, body) {
            if (err) {
                console.log("error", err);
                throw err;
            }
            let is = body.data;
            assert.equal(is.length, 1);
            let i = is[0];
            assert.isNumber(i.id)
            assert.equal(i.name, interests[0].name)
            
        }
    }
})

.addBatch({
    '4. Get user details': {
        topic: function () {
            req.get('user/details', 
                this.callback);
        },
        'response is 200': testHelper.assertSuccess(),
        'should return user details including interests ': function (err, result, body) {
            if (err) {
                console.log("error", err);
                throw err;
            }
            let u = body.data;
            
            assert.isArray(u.interests)
            assert.equal(u.interests.length, 2);

            let i0 = _.find(u.interests, i => (i.id == interests[0].id));
            let i1 = _.find(u.interests, i => (i.id == interests[1].id));

            assert.equal(i0.name, interests[0].name)
            assert.equal(i1.name, interests[1].name)
        }
    }
})

.addBatch({
    '5. Remove user Interest': {
        topic: function () {
            req.delete('user/interest', 
                {body: {interestId: interests[0].id}},
                this.callback);
        },
        'response is 200': testHelper.assertSuccess(),
        'should return affected interests ': function (err, result, body) {
            if (err) {
                console.log("error", err);
                throw err;
            }

            assert.isNumber(body.affected)
        }
    }
})

.addBatch({
    '6. Get user details': {
        topic: function () {
            req.get('user/details', 
                this.callback);
        },
        'response is 200': testHelper.assertSuccess(),
        'should return user details including interests ': function (err, result, body) {
            if (err) {
                console.log("error", err);
                throw err;
            }
            let u = body.data;
            
            assert.isArray(u.interests)
            assert.equal(u.interests.length, 1);

            let i1 = _.find(u.interests, i => (i.id == interests[1].id));

            assert.equal(i1.name, interests[1].name)
        }
    }
})


.export(module);


