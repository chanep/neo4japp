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
    '1. Set some employees knowledges': {
        topic: function () {
            let s = data.skills;
            e = data.employees;
            approverDa.setKnowledge(e[0].id, s[0], ks[0].level, ks[0].want)
                .then(k => {
                    ks[0].id = k.id;
                    return approverDa.setKnowledge(e[0].id, s[1], ks[1].level, ks[1].want)
                })
                .then(k => {
                    ks[1].id = k.id;
                    return approverDa.setKnowledge(e[0].id, s[2], ks[2].level, ks[2].want)
                })
                .then(k => {
                    ks[2].id = k.id;
                    return approverDa.setKnowledge(e[1].id, s[3], ks[3].level, ks[3].want)
                })
                .then(k => {
                    ks[3].id = k.id;
                    return approverDa.setKnowledge(e[1].id, s[4], ks[4].level, ks[4].want)
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

.addBatch(testHelper.loginBatch(r => req = r, () => data.approver.username))

.addBatch({
    '2. Set an other knowledge': {
        topic: function () {
            let skill1 = data.skills[data.skills.length - 1];
            ks[1].skill = skill1;
            skills.push(skill1);
            req.put('user/knowledge', 
                {body: {skillId: skill1.id, level: ks[1].level, want: ks[1].want}},
                this.callback);
        },
        'response is 200': testHelper.assertSuccess(),
        'should return knowledge ': function (err, result, body) {
            if (err) {
                console.log("error", err);
                throw err;
            }
            let k = body.data;
            assert.isNumber(k.id);
            assert.equal(k.level, ks[1].level)
            assert.equal(k.want, ks[1].want)
        }
    }
})

.addBatch({
    '3. Get user details': {
        topic: function () {
            req.get('user/details', 
                this.callback);
        },
        'response is 200': testHelper.assertSuccess(),
        'should return user details including knowledges ': function (err, result, body) {
            if (err) {
                console.log("error", err);
                throw err;
            }
            let u = body.data;
            let e = data.employee;

            assert.isObject(u);
            assert.equal(u.id, e.id);
            assert.equal(u.username, e.username);
            assert.equal(u.type, e.type);
            assert.equal(u.email, e.email);
            assert.equal(u.fullname, e.fullname);
            assert.equal(u.phone, e.phone);

            assert.isObject(u.office);
            assert.equal(u.office.name, e.office.name);
            assert.isObject(u.department);
            assert.equal(u.department.name, e.department.name);
            assert.isObject(u.position);
            assert.equal(u.position.name, e.position.name);

            assert.isArray(u.skillGroups);
            assert.equal(u.skillGroups.length, 2);

            let sk0 = findSkill(skills[0].id, u.skillGroups);

            assert.isObject(sk0);
            assert.equal(sk0.name, skills[0].name);
            assert.isObject(sk0.knowledge);
            assert.equal(sk0.knowledge.level, ks[0].level);
            assert.equal(sk0.knowledge.want, ks[0].want);

            let sk1 = findSkill(skills[1].id, u.skillGroups);
            assert.isObject(sk1);
            assert.equal(sk1.name, skills[1].name);
            assert.isObject(sk1.knowledge);
            assert.equal(sk1.knowledge.level, ks[1].level);
            assert.equal(sk1.knowledge.want, ks[1].want);

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

