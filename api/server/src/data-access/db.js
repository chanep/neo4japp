'use strict'
const seraph = require('seraph');
const config = require('../shared/config').db;

const neo4j = require('neo4j-driver').v1;
const driver = neo4j.driver(config.server, neo4j.auth.basic(config.user, config.pass));

module.exports = driver;