'use strict'
const _ = require('lodash');
const dbHelper = require('../db-utils/db-helper');
const config = require('../shared/config');
const roles = require('../models/roles');
const userDa = new (require('../data-access/user'));
const officeDa = new (require('../data-access/office'));
const departmentDa = new (require('../data-access/department'));
const positionDa = new (require('../data-access/position'));
const skillDa = new (require('../data-access/skill'));
const skillGroupDa = new (require('../data-access/skill-group'));

module.exports = {
    resetDb: resetDb,
    createUser: createUser,
    upsertOffice: upsertOffice,
    upsertDepartment: upsertDepartment,
    upsertPosition: upsertPosition,
    createSkillGroups: createSkillGroups,
    createBasicData: createBasicData
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

function upsertOffice(values, index){
    let i = index || '';
    let officeDefaults = {
        zip:	'C1414DAP',
        country:	'Argentina',
        address:	'Uriarte 1572',
        acronym:	'BA' + i,
        phone:	'+54 11 5984 0500',
        latitude:	-34.587572,
        name:	'Buenos Aires' + i,
        description:	'Buenos Aires' + i,
        uri:	'buenos-aires',
        longitude:	-58.43251,
        sourceId: "cwid" + i
    };

    let officeData = _.extend({}, officeDefaults, values);

    return officeDa.upsert(officeData, ["name"])
}

function upsertDepartment(name){
    name = name || 'Technology';
    return departmentDa.upsert({name: name}, ["name"])
}

function upsertPosition(name){
    name = name || 'Developer';
    return positionDa.upsert({name: name}, ["name"]);
}

function createSkillGroups(){
    let data = {};
    let sg = [
        {name: 'sg0', type: 'tool'},
        {name: 'sg1', type: 'skill'}, 
        {name: 'sg00', type: 'tool'},
        {name: 'sg01', type: 'tool'},
        {name: 'sg10', type: 'skill'}, 
        {name: 'sg11', type: 'skill'}
    ];

    let s = [{name: 's0'}, {name: 's1'}, {name: 's2'}, {name: 's3'}, {name: 's4'}, {name: 's5'}, {name: 's6'}, {name: 's7'}];

    return skillGroupDa.create(sg[0])
        .then(g => {
            sg[0].id = g.id;
            return skillGroupDa.create(sg[1]);
        })
        .then(g => {
            sg[1].id = g.id;
            return skillGroupDa.createAndRelate(sg[2], sg[0].id, "parent");
        })
        .then(g => {
            sg[2].id = g.id;
            return skillGroupDa.createAndRelate(sg[3], sg[0].id, "parent");
        })
        .then(g => {
            sg[3].id = g.id;
            return skillGroupDa.createAndRelate(sg[4], sg[1].id, "parent");
        })
        .then(g => {
            sg[4].id = g.id;
            return skillGroupDa.createAndRelate(sg[5], sg[1].id, "parent");
        })
        .then(g => {
            sg[5].id = g.id;
            return skillDa.createAndRelate(s[0], sg[2].id, "group");
        })
        .then(sk => {
            s[0].id = sk.id;
            return skillDa.createAndRelate(s[1], sg[2].id, "group");
        })
        .then(sk => {
            s[1].id = sk.id;
            return skillDa.createAndRelate(s[2], sg[3].id, "group");
        })
        .then(sk => {
            s[2].id = sk.id;
            return skillDa.createAndRelate(s[3], sg[3].id, "group");
        })
        .then(sk => {
            s[3].id = sk.id;
            return skillDa.createAndRelate(s[4], sg[4].id, "group");
        })
        .then(sk => {
            s[4].id = sk.id;
            return skillDa.createAndRelate(s[5], sg[4].id, "group");
        })
        .then(sk => {
            s[5].id = sk.id;
            return skillDa.createAndRelate(s[6], sg[5].id, "group");
        })
        .then(sk => {
            s[6].id = sk.id;
            return skillDa.createAndRelate(s[7], sg[5].id, "group");
        })
        .then(sk => {
            s[7].id = sk.id;
            return skillGroupDa.findAll();
        })
        .then(g => {
            data.skillGroups = g;
            data.skills = []
            for(let g1 of g){
                g1.parent = g;
                for(let g2 of g1.children){
                    data.skills = data.skills.concat(g2.skills);
                    for(let s of g2.skills){
                        s.group = g2;
                    }
                }
            } 
            return data;
        })
}


/**
 * @returns {
 *  admin: {}, //admin, all roles
 *  approver: {}, //user aprrover
 *  resourceManager: {}, //user resource Manager
 *  employee: {}, // user employee
 *  employees: [] // all user employee
 *  office: {},
 *  offices: [],
 *  skillGroups: [] //contain children groups and children groups contain skills
 *  skills: [] //contain all skills
 * }
 */
function createBasicData(){
    let data = {};

    return upsertOffice()
        .then(d => {
            data.office = d.data;
            data.offices = [data.office];
            return upsertOffice({}, 2);
        })
        .then(d => {
            data.offices.push(d.data);
            return createUser();
        })
        .then(u => {
            data.admin = u;
            return createUser({roles: [roles.approver]}, 2);
        })
        .then(u => {
            data.approver = u;
            return createUser({roles: [roles.resourceManager]}, 3);
        })
        .then(u => {
            data.resourceManager = u;
            return createUser({roles: []}, 4);
        })
        .then(u => {
            data.employee = u;
            data.employees = [u];          
            return userDa.addApprover(data.employee.id, data.approver.id);
        })
        .then(() => {
            return userDa.addResourceManager(data.employee.id, data.resourceManager.id);
        })
        .then(() => {
            return createUser({roles: []}, 5);
        })
        .then(u => {
            data.employees.push(u);
            return userDa.addApprover(data.employees[1].id, data.approver.id);
        })
        .then(() => {
            return userDa.addResourceManager(data.employees[1].id, data.resourceManager.id);
        })
        .then(() => {
            return createSkillGroups();
        })
        .then(sgData => {
            data.skillGroups = sgData.skillGroups;
            data.skills = sgData.skills;
            return data;
        });
}

