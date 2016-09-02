'use strict'
const _ = require('lodash');
const vows = require('vows');
const assert = require('assert'); 
const testHelper = require('../test-helper'); 

let req = null;
let data = null;

let skills = [];
let ks = [
    {level: 3, want: false},
    {level: null, want: true}
];


vows.describe('User api test')

.addBatch(testHelper.resetTestDbBatch())
.addBatch(testHelper.createBasicDataBatch(d => data = d))

.addBatch(testHelper.loginBatch(r => req = r, () => data.employee.username))
.addBatch({
    '1. Set a knowledge': {
        topic: function () {
            let skill0 = data.skills[0];
            ks[0].skill = skill0;
            skills.push(skill0);
            req.put('user/knowledge', 
                {body: {skillId: skill0.id, level: ks[0].level, want: ks[0].want}},
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
            assert.equal(k.level, ks[0].level)
            assert.equal(k.want, ks[0].want)
        }
    }
})

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
    '4. Get user details': {
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

            //console.log("user", JSON.stringify(u));

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

            assert.isArray(u.clients);
            assert.isTrue(!!u.clients[0].short);

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

