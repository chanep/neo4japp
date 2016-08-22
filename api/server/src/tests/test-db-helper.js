'use strict'
const _ = require('lodash');
const dbHelper = require('../db-utils/db-helper');
const config = require('../shared/config');
const roles = require('../models/roles');
const userDa = new (require('../data-access/user'));
const officeDa = new (require('../data-access/department'));
const departmentDa = new (require('../data-access/department'));
const positionDa = new (require('../data-access/department'));

module.exports = {
    resetDb: resetDb,
    createUser: createUser,
    upsertOffice: upsertOffice,
    upsertDepartment: upsertDepartment,
    upsertPosition: upsertPosition
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

function createUser(values, index){
    let i = index || '';
    let userDefaults = {
        username: 'pepetest' + i,
        email: `pepe.test${i}@rga.com`,
        fullname: 'Pepe Test' + i,
        type: 'UserEmployee',
        roles: roles.allRoles
    };

    let userData = _.extend({}, userDefaults, values);

    let office, department, position, user;
    return upsertOffice()
        .then(o => {
            office = o.data;
            return upsertDepartment();
        })
        .then(d => {
            department = d.data;
            return upsertPosition();
        })
        .then(p => {
            position = p.data;
            return userDa.create(userData);
        })
        .then(u => {
            user = u;
            return userDa.setOffice(user.id, office.id)
        })
        .then(() => {
            return userDa.setDepartment(user.id, department.id)
        })
        .then(() => {
            return userDa.setPosition(user.id, position.id)
        })
        .then(() => {
            return userDa.findOne({id: user.id, includes:["office", "department", "position"]})
        });
}

function upsertOffice(values){
    let officeDefaults = {
        zip:	'C1414DAP',
        country:	'Argentina',
        address:	'Uriarte 1572',
        acronym:	'BA',
        phone:	'+54 11 5984 0500',
        latitude:	-34.587572,
        name:	'Buenos Aires',
        description:	'Buenos Aires',
        uri:	'buenos-aires',
        longitude:	-58.43251
    };

    let officeData = _.extend({}, officeDefaults, values);

    return officeDa.upsert(officeData, ["name"])
}

function upsertDepartment(name = 'Technology'){
    return departmentDa.upsert({name: name}, ["name"])
}

function upsertPosition(name = 'Developer'){
    return positionDa.upsert({name: name}, ["name"]);
}

