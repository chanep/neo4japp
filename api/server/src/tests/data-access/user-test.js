'use strict'
const _ = require('lodash');
const vows = require('vows');
const assert = require('assert'); 
const testHelper = require('../test-helper'); 
const userDa = new (require('../../data-access/user'));
const departmentDa = new (require('../../data-access/department'));

let department = {
    name: 'cucamona'
}

let user = {
    username: 'estebant',
    email: 'esteban.test@rga.com',
    fullname: 'Esteban Test',
    type: 'UserUser'
};


vows.describe('User data access test')

.addBatch(testHelper.resetTestDbBatch())

.addBatch({
    '1. create user': {
        topic: function () {
            userDa.create(user)
                .then(r => this.callback(null, r))
                .catch(err => this.callback(err))
        },
        'should create user': function (err, result) {
            if(err){
                console.log("error", err)
                throw err;
            }
            user.id = result.id;
        }
    }
})

.addBatch({
    '2. create department': {
        topic: function () {
            departmentDa.create(department)
                .then(r => this.callback(null, r))
                .catch(err => this.callback(err))
        },
        'should create deaprtment': function (err, result) {
            if(err){
                console.log("error", err)
                throw err;
            }
            department.id = result.id;
        }
    }
})

.addBatch({
    '3. relate user with department': {
        topic: function () {
            userDa.setDepartment(user.id, department.id)
                .then(r => this.callback(null, r))
                .catch(err => this.callback(err))
        },
        'should relate': function (err, result) {
            if(err){
                console.log("error", err)
                throw err;
            }
        }
    }
})

.export(module);