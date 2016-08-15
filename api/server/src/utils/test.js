'use strict'
const _ = require('lodash');
let path = require('path');
let envFile = path.resolve(__dirname, "../.env");
let errors = require('../shared/errors');

require('dotenv').config({path: envFile});

let db = require('../data-access/db');

const queryHelper = require('../data-access/query-helper')
const CypherHelper = require('../data-access/cypher-helper')


// let query = {
//     id: 4,
//     a: 'hola',
//     b: {$in:[5,6]},
//     c: new Date(),
//     includes: [{key: "knowledges", relQuery: {level: 5}, includes: ["group"]}]
// };


// let query = {
//     id: 4,
//     username: 'estebanc',
//     emaqil: {$like: '%.com'},
//     knowledges: {$relExists: false},
//     c: new Date(),
//     includes: [{key: "office", query: {acronym: "BA"}}]
// };


// let model = require("../data-access/models").user;

// const cypherHelper = new CypherHelper(model);

// let cmd = cypherHelper.findCmd(query)[0];

// console.log(cmd)

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


// let include = {
//                 key : "knowledges",
//                 includes : ["group"]
//             }
// const userModel = require('../data-access/models').user;
// const CypherHelper = require('../data-access/cypher-helper');
// let cypher = new CypherHelper(userModel);

// let parsed = cypher.parseIncludes([include], userModel, 'n');
// console.log("parsed", JSON.stringify(parsed))

// const UserDa = require('../data-access/user');
// let userDa = new UserDa();
// let user = {
//     username: 'estebant',
//     email: 'esteban.test@rga.com',
//     fullname: 'Esteban Test',
//     type: "UserUser",
//     phone: null
// };

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

