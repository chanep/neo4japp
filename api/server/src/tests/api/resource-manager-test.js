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
                    return approverDa.addInterest(e[0].id, data.interests[0].name);
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
    '2b. Find users by skills and interests': {
        topic: function () {
            let s = data.skills;
            var search = {
                interests: [data.interests[0].id]
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
            assert.equal(users.length, 1);
            assert.equal(users[0].id, e[0].id);
        }
    }
 })

.addBatch({
    '2c. Find users by wrong interest': {
        topic: function () {
            let s = data.skills;
            var search = {
                interests: [data.interests[1].id]
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
            assert.equal(users.length, 0);
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

.addBatch({
    '5b. Find users by skills orderby fullname desc': {
        topic: function () {
            let s = data.skills;
            var search = {
                skills: [s[0].id, s[2].id],
                orderBy: "fullname_desc"
            };
            var queryString = qs.stringify(search, { encode: false });

            req.get('resource-manager/users-by-skill?'+ queryString, 
                this.callback);
        },
        'response is 200': testHelper.assertSuccess(),
        'should return user with searched skills order by fullname desc': function (err, result, body) {
            if (err) {
                console.log("error", err);
                throw err;
            }
            let users = body.data;
            //console.log('body', JSON.stringify(body));
            assertUsers(users);
            assert.equal(users.length, 2);
            assert.equal(users[1].id, e[0].id);
        }
    }
})

.addBatch({
    '6. Find top skill search': {
        topic: function () {
            var search = {
                limit: 20
            };
            var queryString = qs.stringify(search, { encode: false });

            req.get('resource-manager/top-skill-searches?'+ queryString, 
                this.callback);
        },
        'response is 200': testHelper.assertSuccess(),
        'should return user with searched skills': function (err, result, body) {
            if (err) {
                console.log("error", err);
                throw err;
            }
            let skills = body.data;
            //console.log('skills', JSON.stringify(skills));
            assert.isArray(skills);
            for(let s of skills){
                assert.isNumber(s.searches);
            }
        }
    }
})

.addBatch({
    '7. Find skilled user count by office': {
        topic: function () {
            let skillId = data.skills[0].id;

            req.get('/resource-manager/skilled-users-by-office/' + skillId, 
                this.callback);
        },
        'response is 200': testHelper.assertSuccess(),
        'should return user with searched skills': function (err, result, body) {
            if (err) {
                console.log("error", err);
                throw err;
            }
            let offices = body.data;
            //console.log('offices', JSON.stringify(offices));
            assert.isArray(offices);
            assert.equal(offices.length, 1);
            for(let o of offices){
                assert.isNumber(o.skilledUserCount);
            }
        }
    }
})

.addBatch({
    '8. Find similar skilled users': {
        topic: function () {
            var search = {
                limit: 10
            };
            var queryString = qs.stringify(search, { encode: false });

            let userId = data.employees[1].id;
            req.get(`user/${userId}/similar-skilled-users?` + queryString, 
                this.callback);
        },
        'response is 200': testHelper.assertSuccess(),
        'should return user with searched skills': function (err, result, body) {
            if (err) {
                console.log("error", err);
                throw err;
            }
            let similarUsers = body.data;
            //console.log('similarUsers', JSON.stringify(similarUsers));
            assert.isArray(similarUsers);
            assert.equal(similarUsers[0].id, data.employees[0].id);
            assert.equal(similarUsers[0].similitudeScore, 5);
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
        assert.isArray(u.industries);
        assert.isArray(u.interests);
        assert.isArray(u.clients);
        for(let s of u.skills){
            if(!s.want)
                assert.isNumber(s.level);
            else
                assert.isTrue(!s.level);
            assert.isString(s.name);
        }
    }
    
}
