'use strict'
const _ = require('lodash');
const qs = require('qs');
const vows = require('vows');
const assert = require('assert'); 
const testHelper = require('../test-helper'); 
const approverDa = new (require('../../data-access/approver'));

let req = null;
let data = null;

let ks = [
    {level: 3},
    {level: null, want: true},
    {level: 2},

    {level: 3},
    {level: 1, want: false}
];

let e;


vows.describe('Resource Manager api test')

.addBatch(testHelper.resetTestDbBatch())
.addBatch(testHelper.createBasicDataBatch(d => data = d))

.addBatch({
    '1. Set employees knowledges': {
        topic: function () {
            let s = data.skills;
            e = data.employees;
            approverDa.setKnowledge(e[0].id, s[0].id, ks[0].level, ks[0].want)
                .then(k => {
                    ks[0].id = k.id;
                    return approverDa.setKnowledge(e[0].id, s[1].id, ks[1].level, ks[1].want)
                })
                .then(k => {
                    ks[1].id = k.id;
                    return approverDa.setKnowledge(e[0].id, s[2].id, ks[2].level, ks[2].want)
                })
                .then(k => {
                    ks[2].id = k.id;
                    return approverDa.setKnowledge(e[1].id, s[0].id, ks[3].level, ks[3].want)
                })
                .then(k => {
                    ks[3].id = k.id;
                    return approverDa.setKnowledge(e[1].id, s[1].id, ks[4].level, ks[4].want)
                })
                .then(k => {
                    ks[4].id = k.id;
                    return approverDa.approveKnowledge(data.approver.id, ks[0].id);
                })
                .then(() => {
                    return approverDa.approveKnowledge(data.approver.id, ks[3].id);
                })
                .then(() => {
                    this.callback();
                })
                .catch(err => this.callback(err))
        },
        'should create knowledge ': function (err, result, body) {
            if (err) {
                console.log("error", err);
                throw err;
            }
        }
    }
})

.addBatch(testHelper.loginBatch(r => req = r, () => data.resourceManager.username))

.addBatch({
    '2. Find users by skills': {
        topic: function () {
            let s = data.skills;
            var search = {
                skills: [s[0].id, s[1].id]
            };
            var queryString = qs.stringify(search, { encode: false });

            req.get('resource-manager/users-by-skill?'+ queryString, 
                this.callback);
        },
        'response is 200': testHelper.assertSuccess(),
        'should return user with searched skills': function (err, result, body) {
            if (err) {
                console.log("error", err);
                throw err;
            }
            let users = body.data;
            //console.log('body', JSON.stringify(body));
            assertUsers(users);
            assert.equal(users.length, 2);
            assert.equal(users[0].id, e[1].id);
        }
    }
})

.addBatch({
    '3. Find users by skills and wrong office': {
        topic: function () {
            let s = data.skills;
            var search = {
                skills: [s[0].id, s[1].id],
                offices: [data.offices[1].id]
            };
            var queryString = qs.stringify(search, { encode: false });

            console.log('query', queryString);
            req.get('resource-manager/users-by-skill?'+ queryString, 
                this.callback);
        },
        'response is 200': testHelper.assertSuccess(),
        'should return user with searched skills': function (err, result, body) {
            if (err) {
                console.log("error", err);
                throw err;
            }
            let users = body.data;
            //console.log('body', JSON.stringify(body));
            assert.equal(users.length, 0);
        }
    }
})

.addBatch({
    '4. Find users by skills and right office': {
        topic: function () {
            let s = data.skills;
            var search = {
                skills: [s[0].id, s[1].id],
                offices: [data.offices[0].id]
            };
            var queryString = qs.stringify(search, { encode: false });

            req.get('resource-manager/users-by-skill?'+ queryString, 
                this.callback);
        },
        'response is 200': testHelper.assertSuccess(),
        'should return user with searched skills': function (err, result, body) {
            if (err) {
                console.log("error", err);
                throw err;
            }
            let users = body.data;
            //console.log('body', JSON.stringify(body));
            assert.equal(users.length, 2);
        }
    }
})

.addBatch({
    '5. Find users by skills': {
        topic: function () {
            let s = data.skills;
            var search = {
                skills: [s[0].id, s[2].id]
            };
            var queryString = qs.stringify(search, { encode: false });

            req.get('resource-manager/users-by-skill?'+ queryString, 
                this.callback);
        },
        'response is 200': testHelper.assertSuccess(),
        'should return user with searched skills': function (err, result, body) {
            if (err) {
                console.log("error", err);
                throw err;
            }
            let users = body.data;
            //console.log('body', JSON.stringify(body));
            assertUsers(users);
            assert.equal(users.length, 2);
            assert.equal(users[0].id, e[0].id);
        }
    }
})


.export(module);

function assertUsers(users){
    if(!Array.isArray(users))
        users = [users];
    for(let u of users){
        assert.isTrue(!!u.username);
        assert.isObject(u.office);
        assert.isObject(u.position);
        assert.isArray(u.approvers);
        for(let s of u.skills){
            assert.isNumber(s.level);
            assert.isString(s.name);
        }
    }
    
}