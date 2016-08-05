'use strict'
const errors = require('../shared/errors');
const P = require('bluebird');
const BaseTask = require('./base-task');

class CwBaseTask extends BaseTask{
    constructor(name){
        super(name);
    }
    login(){
        
    }
}

module.exports = CwBaseTask;