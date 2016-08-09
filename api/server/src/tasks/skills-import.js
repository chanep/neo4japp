'use strict'
const errors = require('../shared/errors');
const P = require('bluebird');
const BaseTask = require('./base-task');
const SkillGroupDa = require('../data-access/skill-group');

class SkillImportTask extends BaseTask{
    constructor(){
        super('tasks-import');
    }

    _checkLevels(args) {

    }

    _doRun(){
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
						for(var index = 0; index < rows.length; index++) {
							var row = rows[index];
							
							this._checkLevels({
								'level1': {
									'value': rows['level1']
								},
								'level2': {
									'value': rows['level2']
								},
								'level3': {
									'value': rows['level3']
								}
							});

							/*
							if (cell.value && cell.row > 1) {
								if (currentLevel != cell.col) {
									currentLevel = cell.col;
									if (currentLevel == 1) {
										parent['id'] = 0;
										parent['level'] = 0;
										parent['name'] = '';
									} else {
										parent['id'] = last['id'];
										parent['level'] = last['level'];
										parent['name'] = last['name'];
									}
								}
							
								var current = {
									'id': 0,
									'level': cell.col,
									'name': cell.value
								};

								console.log("Parent: " + parent['name'] + ', Current: ' + current['name']);

								last['id'] = current['id'];
								last['level'] = current['level'];
								last['name'] = current['name'];
							*/
								

																/*
								levels[cell.col - 1] = cell.value;
								for(var index = levels.length - 1; index > cell.col; index--)
									levels.splice(index, 1);

								console.log(levels);
								console.log('Cell(' + cell.row + ',' + cell.col + ') --> ' + cell.value);
								*/
						};
					});
				});

				step();
			}
		]);

		return P.resolve("Done");
    }
}

module.exports = SkillImportTask;