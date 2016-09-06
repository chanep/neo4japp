'use strict'
const P = require('bluebird');
const config = require('../shared/config');
const errors = require('../shared/errors');
const BaseController = require('./base-controller');
const userDa = new (require('../data-access/user'));
const skillDa = new (require('../data-access/skill'));

class ResourceManagerController extends BaseController{

} 

module.exports = ResourceManagerController;