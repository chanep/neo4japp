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
            ks[0].id = k.id;
            assert.isNumber(k.id);
            assert.equal(k.level, ks[0].level)
            assert.equal(k.want, ks[0].want)
        }
    }
})

.addBatch({
    '1b. Set an industry': {
        topic: function () {
            let ind = data.industries[0];
            req.put('user/knowledge', 
                {body: {skillId: ind.id, level: 5, want: false}},
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
            ks[1].id = k.id;
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

            assert.isArray(u.approvers);
            assert.isTrue(!!u.approvers[0].fullname);
            assert.isTrue(!!u.approvers[0].department.name);
            assert.isTrue(!!u.approvers[0].position.name);

            assert.isArray(u.resourceManagers);
            assert.isTrue(!!u.resourceManagers[0].fullname);
            assert.isTrue(!!u.resourceManagers[0].department.name);
            assert.isTrue(!!u.resourceManagers[0].position.name);

            assert.isArray(u.clients);
            assert.isTrue(!!u.clients[0].short);

            assert.isArray(u.industries);
            assert.equal(u.industries[0].name, data.industries[0].name);

            assert.equal(u.skillCount, 2);
            assert.equal(u.unapprovedSkillCount, 2);

        }
    }
})

.addBatch(testHelper.loginBatch(r => req = r, () => data.resourceManager.username))

.addBatch({
    '4b. Get user details': {
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

            console.log("user", JSON.stringify(u));

            assert.isObject(u);
            assert.equal(u.unapprovedSkillCount, 0);

        }
    }
})

.addBatch({
    '5. Get all skills (with user knowledges attached)': {
        topic: function () {
            let userId = data.employee.id;
            req.get(`user/${userId}/skills?all=true`, 
                this.callback);
        },
        'response is 200': testHelper.assertSuccess(),
        'should return user details including knowledges ': function (err, result, body) {
            if (err) {
                console.log("error", err);
                throw err;
            }
            let skillGroups = body.data;

            //console.log('skillGoups', JSON.stringify(skillGroups));

            //skills groups must have all the skills
            for(let s of data.skills){
                let sAux = findSkill(s.id, skillGroups);
                assert.isNotNull(sAux);
            }

            //known skills must have the user knowledge attached
            
            for(let k of ks){
                let sAux = findSkill(k.skill.id, skillGroups);
                assert.isNotNull(sAux.knowledge);
                assert.equal(sAux.knowledge.id, k.id);
            }
        }
    }
})

.addBatch({
    '6. Get user skills (with user knowledges attached)': {
        topic: function () {
            let userId = data.employee.id;
            req.get(`user/${userId}/skills`, 
                this.callback);
        },
        'response is 200': testHelper.assertSuccess(),
        'should return user details including knowledges ': function (err, result, body) {
            if (err) {
                console.log("error", err);
                throw err;
            }
            let skillGroups = body.data;

            //console.log('skillGoups', JSON.stringify(skillGroups));

            //skills groups must have only the skills with knowledge
            for(let g of skillGroups){
                for(let cg of g.children){
                    for(let s of cg.skills){
                        assert.isNotNull(s.knowledge);
                    }
                }
            }

            //known skills must have the user knowledge attached
            
            for(let k of ks){
                let sAux = findSkill(k.skill.id, skillGroups);
                assert.isNotNull(sAux.knowledge);
                assert.equal(sAux.knowledge.id, k.id);
            }
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
           let s = findSkill(id, g.children);
           if(s)
                return s;
        }
    }
    return null;
}

