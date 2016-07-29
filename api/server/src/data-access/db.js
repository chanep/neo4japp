'use strict'
const Promise = require('bluebird');
const seraph = require('seraph');
const config = require('../shared/config').db;
const db = seraph(config);

db.save = Promise.promisify(db.save);
db.delete = Promise.promisify(db.delete);
db.query = Promise.promisify(db.query);
db.queryRaw = Promise.promisify(db.queryRaw);


module.exports = db;