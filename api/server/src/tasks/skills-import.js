'use strict'
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

        let info = {
            updated: 0,
            created: 0,
            errors: 0
        };

		var GoogleSpreadsheet = require('google-spreadsheet');
		var async = require('async');
		var doc = new GoogleSpreadsheet('1ExPMQwoHZEvXrcxEwxROfWZH1AmPWySqY4_tD58aZ04');
		var sheet;

		async.series([
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
						var cells = [];
						
						async.eachSeries = P.promisify(async.eachSeries);
						return async.eachSeries(rows, function (row, callback) {
							let skillGroup = _this._transformSkillGroup(row);
							
							let skillGroupDa = new SkillGroupDa();


							callback();
						}).then(() => {
            				console.log("info", info)
            				return info;
    					});
					});
				});

				step();
			}
		]);

		return P.resolve("Done");
    }

    _transformSkillGroup(row) {
        let skillGroup = _.pick(row, ['level1']);
        skillGroup.name = row['level1'];
        skillGroup.level = 1;
        return skillGroup;
    }
}

module.exports = SkillImportTask;