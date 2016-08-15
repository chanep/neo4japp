'use strict'
const _ = require('lodash');
const dbHelper = require('../db-utils/db-helper');
const config = require('../shared/config');

module.exports = {
    resetDb: resetDb
}




function resetDb(partitionSuffix){
        let labels = [
            'AppSetting',
            'Skill',
            'SkillGroup',
            'Office',
            'Department',
            'Position',
            'User',
            'TaskStatus'
        ];
        for(let i in labels){
            labels[i] += partitionSuffix;
        }
        return dbHelper.deleteLabels(labels)
            .then(() =>{
                return dbHelper.applyScripts(partitionSuffix);
            });
}
