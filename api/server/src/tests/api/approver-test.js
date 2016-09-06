'use strict'
const _ = require('lodash');
const vows = require('vows');
const assert = require('assert'); 
const testHelper = require('../test-helper'); 
const approverDa = new (require('../../data-access/approver'));

let req = null;
let data = null;

let ks = [
    {level: 3, want: false},
    {level: null, want: true},
    {level: null, want: true},

    {level: 3, want: false},
    {level: 4, want: false}
];

let e;


vows.describe('Approver api test')

.addBatch(testHelper.resetTestDbBatch())
.addBatch(testHelper.createBasicDataBatch(d => data = d))

.addBatch({
    '1. Set one employee knowledges': {
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

.addBatch(testHelper.loginBatch(r => req = r, () => data.approver.username))

.addBatch({
    '2. Get approver team': {
        topic: function () {
            req.get('approver/my-team?onlyPendingApproval=true', 
                this.callback);
        },
        'response is 200': testHelper.assertSuccess(),
        'should return user details including knowledges ': function (err, result, body) {
            if (err) {
                console.log("error", err);
                throw err;
            }
            let employees = body.data;
            assert.equal(employees.length, 1)
            assertTeamMembers(employees, true, false);
        }
    }
})

.addBatch({
    '3. Get approver team': {
        topic: function () {
            req.get('approver/my-team?onlyPendingApproval=false', 
                this.callback);
        },
        'response is 200': testHelper.assertSuccess(),
        'should return user details including knowledges ': function (err, result, body) {
            if (err) {
                console.log("error", err);
                throw err;
            }
            let employees = body.data;

            assert.equal(employees.length, 2)
            assertTeamMembers(employees, false, false);
        }
    }
})

.addBatch({
    '4. Set other employee knowledges': {
        topic: function () {
            let s = data.skills;
            approverDa.setKnowledge(e[1].id, s[3].id, ks[3].level, ks[3].want)
                .then(k => {
                    ks[3].id = k.id;
                    return approverDa.setKnowledge(e[1].id, s[4].id, ks[4].level, ks[4].want)
                })
                .then(k => {
                    ks[4].id = k.id;
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

.addBatch({
    '5. Get approver team': {
        topic: function () {
            req.get('approver/my-team?onlyPendingApproval=true', 
                this.callback);
        },
        'response is 200': testHelper.assertSuccess(),
        'should return user details including knowledges ': function (err, result, body) {
            if (err) {
                console.log("error", err);
                throw err;
            }
            let employees = body.data;
            assert.equal(employees.length, 2)
            assertTeamMembers(employees, true, false);
            assert.isTrue(employees[0].totalPendingApproval >= employees[1].totalPendingApproval);

        }
    }
})

.addBatch({
    '6. Get approver team': {
        topic: function () {
            req.get('approver/my-team?onlyPendingApproval=false&includeWantSkills=true', 
                this.callback);
        },
        'response is 200': testHelper.assertSuccess(),
        'should return user details including knowledges ': function (err, result, body) {
            if (err) {
                console.log("error", err);
                throw err;
            }
            let employees = body.data;
            assert.equal(employees.length, 2)
            assertTeamMembers(employees, false, true);
        }
    }
})

.addBatch({
    '7. Approve a knowledge': {
        topic: function () {
            req.put('approver/approve',
                {body: {knowledgeId: ks[0].id}},
                this.callback);
        },
        'response is 200': testHelper.assertSuccess(),
        'should return user details including knowledges ': function (err, result, body) {
            if (err) {
                console.log("error", err);
                throw err;
            }
        }
    }
})

.addBatch({
    '8. Verify knowledge approval': {
        topic: function () {
            req.get('approver/my-team?onlyPendingApproval=false', 
                this.callback);
        },
        'response is 200': testHelper.assertSuccess(),
        'should return user details including knowledges ': function (err, result, body) {
            if (err) {
                console.log("error", err);
                throw err;
            }
            let employees = body.data;
            let k = findKnowledge(ks[0].id, employees);
            assert.isNotNull(k);
            assert.isTrue(k.approved);
            assert.equal(k.approverId, data.approver.id);
        }
    }
})

.addBatch({
    '9. Disapprove a knowledge': {
        topic: function () {
            req.put('approver/approve',
                {body: {knowledgeId: ks[0].id, disapprove: true}},
                this.callback);
        },
        'response is 200': testHelper.assertSuccess(),
        'should return user details including knowledges ': function (err, result, body) {
            if (err) {
                console.log("error", err);
                throw err;
            }
        }
    }
})

.addBatch({
    '10. Verify knowledge disapproval': {
        topic: function () {
            req.get('approver/my-team?onlyPendingApproval=false', 
                this.callback);
        },
        'response is 200': testHelper.assertSuccess(),
        'should return user details including knowledges ': function (err, result, body) {
            if (err) {
                console.log("error", err);
                throw err;
            }
            let employees = body.data;
            let k = findKnowledge(ks[0].id, employees);
            assert.isNotNull(k);
            assert.isFalse(k.approved);
        }
    }
})

.export(module);


function findSkill(id, groups){
    for(let g of groups){
        if(g.skills){
            let s = _.find(g.skills, {id: id});
            if(s)
                return s;
        } else if (g.children){
            return findSkill(id, g.children);
        }
    }
    return null;
}

function findKnowledge(id, employees){
    for(let e of employees){
        if(e.skillGroups){
            for(let g of e.skillGroups){
                let s = _.find(g.skills, s => {
                    return (s.knowledge.id == id);
                });
                if(s)
                    return s.knowledge;
            }
        }
    }
    return null;
}

function assertTeamMembers(members, onlyPendingApproval, includeWantSkills){
    if(!Array.isArray(members))
        members = [members];
    for(let m of members){
        assert.isTrue(!!m.username);
        assert.isObject(m.office);
        assert.isObject(m.department);
        assert.isObject(m.position);
        assert.isNumber(m.totalPendingApproval);
        assert.isArray(m.skillGroups);
        for(let sg of m.skillGroups){
            assert.isNumber(sg.pendingApprovalCount);
            assert.isObject(sg.parent);
            assert.isArray(sg.skills);
            for(let s of sg.skills){
                if(onlyPendingApproval)
                    assert.isTrue(!s.knowledge.approved)
                if(!includeWantSkills)
                    assert.isTrue(!s.knowledge.want)
                assert.isString(s.name);
                assert.isObject(s.knowledge);
                
            }
        }
    }
    
}
