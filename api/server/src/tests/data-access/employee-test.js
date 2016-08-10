'use strict'
const _ = require('lodash');
const vows = require('vows');
const assert = require('assert'); 
const testHelper = require('../test-helper'); 
const employeeDa = new (require('../../data-access/employee'));
const departmentDa = new (require('../../data-access/department'));

let department = {
    name: 'cucamona'
}

let employee = {
    username: 'estebant',
    email: 'esteban.test@rga.com',
    fullname: 'Esteban Test',
};


vows.describe('Employee data access test')

.addBatch(testHelper.resetTestDbBatch())

.addBatch({
    '1. create employee': {
        topic: function () {
            employeeDa.create(employee)
                .then(r => this.callback(null, r))
                .catch(err => this.callback(err))
        },
        'should create employee': function (err, result) {
            if(err){
                throw err;
            }
            employee.id = result.id;
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
                throw err;
            }
            department.id = result.id;
        }
    }
})

.addBatch({
    '3. relate employee with department': {
        topic: function () {
            employeeDa.setDepartment(employee.id, department.id)
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