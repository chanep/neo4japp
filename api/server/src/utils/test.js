'use strict'
const _ = require('lodash');
let path = require('path');
//let envFile = path.resolve(__dirname, "../.env");
let envFile = path.resolve(__dirname, "../.test-env");
let errors = require('../shared/errors');

require('dotenv').config({path: envFile});

let db = require('../data-access/db');
const neo4j = require('neo4j-driver').v1;

// const Joi = require('joi');
// let schema = {key: Joi.array().items(Joi.string()).default([])};
// let data = {key: [null]};
// var result = Joi.validate(data, schema);
// console.log(result)

// let managersTask = new (require('../tasks/pl-import/managers-import'));
// managersTask._getUserManagersEmail(45553)
//     .then(r => {
//         console.log(JSON.stringify(r))
//     })
//     .catch(console.error);


///Login Service
// let LoginService = require('../services/login');
// let login = new LoginService();


// const queryHelper = require('../data-access/query-helper')
// const CypherHelper = require('../data-access/cypher-helper')
// let ch = new CypherHelper(null);


// RAW Cypher Command
//----------------------------------------------------
// let session = db.session();

// let cmd = `match (n:SkillGroup_T)<-[:BELONGS_TO]-(m:Skill_T)<--(o:User_T) return n, m, o`;
// let params = {ids: [neo4j.int(230)]};
// session.run(cmd, params)
//     .then(r => {
//         console.log(JSON.stringify(r))
//         console.log(JSON.stringify(ch.parseResultArrayRaw(r, null)))
//     })
//     .catch(console.error);




const Da = require('../data-access/approver');
let da = new Da();

//da.isApproverOf(4840, 4837)
da.isApproverOf(4837, 4840)
.then(r =>{
        console.log("result", JSON.stringify(r));
    })
    .catch(console.error);

// let allocation = {
//         startDate: ['week1', 'week2', 'week3', 'week4'],
//         weekHours: [10, 20, 30, 40],
//         totalHours: 100,
//     }

// userDa.findOne({username: 'estebanc'})
//     .then(u =>{
//         console.log("u",u)
//        return userDa.setAllocation(323983457, allocation);
//     })
//     .then(r =>{
//         console.log("result", JSON.stringify(r));
//     })
//     .catch(console.error);
// // userDa.create(u)
// .then(r =>{
//         console.log("result", JSON.stringify(r));
//     })
//     .catch(console.error);



// let allocationData = {
//     startDate : new Date(),
//     weekHours: [10, 20, 30, 40],
//     totalHours: 50
// };

// userDa.setAllocation(119, allocationData)
// .then(r =>{
//         console.log("result", JSON.stringify(r));
//     })
//     .catch(console.error);
// userDa._validate(user)
// .then(r =>{
//         console.log("result", JSON.stringify(r));
//     })
//     .catch(console.error);


// userDa.query(`match (n:User:Test) optional match (n)-[r:KNOWS]->(m) return {id: id(n), name: n.name, knowledges: collect({id: ID(r), level: r.level, skill: m})}`)
//     .then(r => {
//         console.log("result", JSON.stringify(r));
//     })


// userDa.create(userData)
//     .then(e => {
//         return userDa.setOffice(e.id, 389);
//     })




// var session  = db.session();
// var cypher = `MATCH (n), (m) where ID(n) = 290 AND ID(m)=292 RETURN n, m`

// session.run(cypher)
//     .then(r => {
//         console.log(JSON.stringify(r))
//     })


// var cypher = `MATCH (sc:SkillCategory)<-[:BELONGS_TO*]-(s) 
//                 WITH sc, collect(s) as skills
//                 RETURN {id: id(sc), name: sc.name, skills: skills}`; 



// db.query(cypher)
//     .then((result) => {
//         console.log("result", JSON.stringify(result));
//     })
//     .catch((err) => {
//         console.log("err", err)
//     });

