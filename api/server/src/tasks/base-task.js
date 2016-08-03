'use strict'
const errors = require('../shared/errors');
const P = require('bluebird');

class BaseTask {
    constructor(label){
        this._label = label;
        this._tx = null;
    }