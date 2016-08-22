'use strict'
const _ = require('lodash');
const vows = require('vows');
const assert = require('assert'); 
const testHelper = require('../test-helper'); 

let req = null;
let user = null;


vows.describe('Skill api test')

.addBatch(testHelper.resetTestDbBatch())
.addBatch(testHelper.createUserBatch(u => user = u))
.addBatch(testHelper.loginBatch(r => req = r))
.addBatch({
    '3. test': {
        topic: function () {
            req.get('test', this.callback);
        },
        'skill group created': function (err, result) {
            if (err) {
                console.log("error", err);
                return;
            }
            console.log(result)
        }
    }
})

.export(module);

