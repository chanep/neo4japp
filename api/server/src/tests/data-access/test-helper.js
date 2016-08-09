var path = require('path');
var envFile = path.resolve(__dirname, "../../.test-env");
require('dotenv').config({path: envFile});

module.exports = {};