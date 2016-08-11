'use strict'
const _ = require('lodash');
let path = require('path');
let envFile = path.resolve(__dirname, "../.env");
let errors = require('../shared/errors');

require('dotenv').config({path: envFile});

let db = require('../data-access/db');


// let [a, b] = ["hola, chau"];
// console.log("a", a)
// console.log("b", b)

//let cmd = `match (n:Skill) optional match (n)-[r:BELONGS_TO]->(m) return {identity: id(n), name: n.name, group: m}`;
// let cmd = `match (n:SkillGroup)
//             optional match (n)<-[r:BELONGS_TO]-(m)
//             return {identity: id(n), name: n.name, skills: collect(m)}`;
// let session = db.session();

// session.run(cmd)
//     .then(r =>{
//         console.log("result", JSON.stringify(r));
//         session.close();
//         db.close();
//     })
//     .catch(console.error);

let parts = ["x", "", "y"];

console.log("parts", parts)

_.remove(parts, p => (p == ""));

console.log("parts", parts)

// let include = {
//                 key : "knowledges",
//                 includes : ["group"]
//             }
// const employeeModel = require('../data-access/models').employee;
// const CypherHelper = require('../data-access/cypher-helper');
// let cypher = new CypherHelper(employeeModel);

// let parsed = cypher.parseIncludes([include], employeeModel, 'n');
// console.log("parsed", JSON.stringify(parsed))

// const EmployeeDa = require('../data-access/employee');
// let employeeDa = new EmployeeDa();

// employeeDa.query(`match (n:Employee:Test) optional match (n)-[r:KNOWS]->(m) return {id: id(n), name: n.name, knowledges: collect({id: ID(r), level: r.level, skill: m})}`)
//     .then(r => {
//         console.log("result", JSON.stringify(r));
//     })


// employeeDa.create(employeeData)
//     .then(e => {
//         return employeeDa.setOffice(e.id, 389);
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

