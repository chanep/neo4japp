'use strict'
const _ = require('lodash');
const vows = require('vows');
const assert = require('assert'); 
const testHelper = require('../test-helper'); 

let req = null;
let user = null;

let clients = [
        {name: "Cocacola"},
        {name: "Patagonia"}
    ];


vows.describe('Client api test')

.addBatch(testHelper.resetTestDbBatch())
.addBatch(testHelper.createUserBatch(u => user = u))

.addBatch(testHelper.loginBatch(r => req = r, () => user.username))
.addBatch({
    '1. Add Client': {
        topic: function () {
            req.put('user/client', 
                {body: {clientName: clients[0].name}},
                this.callback);
        },
        'response is 200': testHelper.assertSuccess(),
        'should return client ': function (err, result, body) {
            if (err) {
                console.log("error", err);
                throw err;
            }
            let c = body.data;
            assert.isNumber(c.id)
            assert.equal(c.name, clients[0].name)
            
            clients[0] = c;
        }
    }
})

.addBatch({
    '2. Add an other Client': {
        topic: function () {
            req.put('user/client', 
                {body: {clientName: clients[1].name}},
                this.callback);
        },
        'response is 200': testHelper.assertSuccess(),
        'should return client ': function (err, result, body) {
            if (err) {
                console.log("error", err);
                throw err;
            }
            let c = body.data;
            assert.isNumber(c.id)
            assert.equal(c.name, clients[1].name)
            
            clients[1] = c;
        }
    }
})

.addBatch({
    '3. Find Client by name': {
        topic: function () {
            req.get('client?name=coca', this.callback);
        },
        'response is 200': testHelper.assertSuccess(),
        'should return client ': function (err, result, body) {
            if (err) {
                console.log("error", err);
                throw err;
            }
            let cs = body.data;
            assert.equal(cs.length, 1);
            let c = cs[0];
            assert.isNumber(c.id)
            assert.equal(c.name, clients[0].name)
            
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
        'should return user details including clients ': function (err, result, body) {
            if (err) {
                console.log("error", err);
                throw err;
            }
            let u = body.data;
            
            assert.isArray(u.clients)

            let c0 = _.find(u.clients, c => (c.id == clients[0].id));
            let c1 = _.find(u.clients, c => (c.id == clients[1].id));

            assert.equal(c0.name, clients[0].name);
            assert.equal(c1.name, clients[1].name);
        }
    }
})

.addBatch({
    '5. Remove user Client': {
        topic: function () {
            req.delete('user/client', 
                {body: {clientId: clients[0].id}},
                this.callback);
        },
        'response is 200': testHelper.assertSuccess(),
        'should return affected clients ': function (err, result, body) {
            if (err) {
                console.log("error", err);
                throw err;
            }

            assert.isNumber(body.affected);
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
        'should return user details including clients ': function (err, result, body) {
            if (err) {
                console.log("error", err);
                throw err;
            }
            let u = body.data;
            
            assert.isArray(u.clients)

            let c0 = _.find(u.clients, c => (c.id == clients[0].id));
            let c1 = _.find(u.clients, c => (c.id == clients[1].id));

            assert.equal(c1.name, clients[1].name);
            assert.isTrue(!c0);
        }
    }
})


.export(module);


