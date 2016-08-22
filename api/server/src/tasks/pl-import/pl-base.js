'use strict'
const errors = require('../../shared/errors');
const P = require('bluebird');
const BaseTask = require('../base-task');
const rp = require('request-promise');
const config = require('../../shared/config').pl;
const xml2js = require('xml2js');

class PlBaseTask extends BaseTask{
    constructor(name){
        super(name);
    }

    callPostWebServices(endpoint, data) {
    	var finalUri = `${config.apiBase}${endpoint}`;
    	var options = {
    		url: finalUri,
    		method: 'POST',
			body: data,
			json: false,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Content-Length': data.length
			}
    	}

    	return rp(options).then(data => {
    		var parser = new xml2js.Parser();
			return parser.parseString(data, function (err, result) {
				let jsonData = JSON.parse(result['string']._);
				return jsonData;
			});
    	});
		
    }
}

module.exports = PlBaseTask;