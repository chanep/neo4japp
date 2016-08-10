'use strict'
const _ = require('lodash');
const async = require('async');
const errors = require('../shared/errors');
const P = require('bluebird');
const BaseTask = require('./base-task');
const SkillGroupDa = require('../data-access/skill-group');

class SkillImportTask extends BaseTask{
    constructor(){
        super('tasks-import');
    }

    _doRun(){
    	let _this = this;

        let inforeturn = {
            updated: 0,
            created: 0,
            errors: 0
        };

		var GoogleSpreadsheet = require('google-spreadsheet');
		var doc = new GoogleSpreadsheet('1ExPMQwoHZEvXrcxEwxROfWZH1AmPWySqY4_tD58aZ04');
		var sheet;

		return async.series([
			function setAuth(step) {
				var creds = require('../googledriveaccess.json');
				doc.useServiceAccountAuth(creds, step);
		  	},

			function getAllSkills(step) {
				doc.getInfo(function(err, info) {
					sheet = info.worksheets[0];
					sheet.getRows({
						'offset': 1,
						'limit': 1000,
						'orderby': 'level1',
						'return-empty': true
					}, function(err, rows) {
						async.eachSeries = P.promisify(async.eachSeries);
						return async.eachSeries(rows, function (row, callback) {
							var skDa = new SkillGroupDa();

	        				skDa.checkLevel1({
    							'name': row['level1'].trim(),
    							'type': row['type'].toLowerCase().trim()
    						}).then(result => {
    							if (result.action == 'inserted')
    								inforeturn.created++;

			        			return result;
			        		}).then(result => {
			        			return skDa.checkLevel2({

			        			}).then(result => {
			        				callback();
			        			});
			        		});
				        }).then(() => {
    	    				console.log("Proc. completed", inforeturn)
							return inforeturn;
				        });
					});
				});

				return step();
			}
		]);

		return P.resolve("Done");
    }
}

module.exports = SkillImportTask;