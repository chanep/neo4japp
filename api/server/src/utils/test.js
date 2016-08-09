'use strict'
let path = require('path');
let envFile = path.resolve(__dirname, "../.env");
let errors = require('../shared/errors');

require('dotenv').config({path: envFile});

let db = require('../data-access/db');


let [a, b] = ["hola, chau"];
console.log("a", a)
console.log("b", b)

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


// const EmployeeDa = require('../data-access/employee');
// let employeeDa = new EmployeeDa();

// employeeDa.create({username: "estebanc"})
//     .then(e => {
//         return employeeDa.setOffice(e.id, 389);
//     })

// let cypher = `MATCH (e:Employee)-[:OF_OFFICE]->(o) 
//                 WHERE e.username = 'estebanc'
//                 RETURN {id: id(e), username: e.username, office: o}`; 
// employeeDa.query(cypher)
//     .then(r => {
//         console.log(JSON.stringify(r))
//     })
//     .catch(console.error)


// var session  = db.session();
// var cypher = `MATCH (n), (m) where ID(n) = 290 AND ID(m)=292 RETURN n, m`

// session.run(cypher)
//     .then(r => {
//         console.log(JSON.stringify(r))
//     })

// const SkillGroupDa = require('../data-access/skill-group');
// const TaskStatusDa = require('../data-access/task-status');
// let da = new SkillGroupDa();
// let ts = new TaskStatusDa();

// ts.find()
//     .then(console.log)
//     .catch(console.error);

// let sg1, sg2;

// da.create({name: "grupo31", type: "skill"})
//     .then(sg => {
//         console.log("sg1", sg);
//         sg1 = sg;
//         return da.create({name: "grupo32", type: "skill"})
//     })
//     .then(sg => {
//         console.log("sg2", sg);
//         sg2 = sg;
//         //return da.relate(sg1.id, sg2.id, "HAS", null, false);
//         return da.relate(sg1.id, sg2.id, "HAS", {relKey: "relValue"}, false);
//     })
//     .then(r => {
//         console.log("rel result", JSON.stringify(r));
//     })
//     .catch(err =>{
//         console.log(err)
//     })
//     .then(() => {
//         db.close();
//     })

// da.relate(351, 352, "HAS", {relKey2: "relValue2"}, false)
//     .then(console.log)
//     .catch(console.error);

// da.create({name: "nombre", k1: "v1", k2: "v2" })
//     // .then(node => {
//     //     let data = {
//     //         id: node.id,
//     //         k1: "v1b"
//     //     }
//     //     return da.save(data);
//     // })
//     .then(r => {
//         console.log(JSON.stringify(r));
//     })
//     .catch(console.error)
//     .then(() => {
//         db.close();
//     })


// da.update({id: 290, k1: "v1xx"})
//     // .then(node => {
//     //     let data = {
//     //         id: node.id,
//     //         k1: "v1b"
//     //     }
//     //     return da.save(data);
//     // })
//     .then(r => {
//         console.log(JSON.stringify(r));
//     })
//     .catch(console.error)
//     .then(() => {
//         db.close();
//     })

// da.create({name: "grupo2"})
//     .then(console.log)
//     .catch(console.error)

// da.find(297)
//     .then(console.log)
//     .catch(console.error)

// da.createAndRelate({name: "grupo23"}, 297, 'BELONGS_TO', {k1: 'v1'}, true)
//     .then(console.log)
//     .catch(console.error)

// da.findAll({name: '*nom*'})
//     .then(console.log)
//     .catch(console.error)

// da.find(292)
//     .then(console.log)
//     .catch(console.error)

// da.save({names: "Grupo 4"})
//     .then(console.log)
//     .catch(console.error)




// var cypher = `MATCH (sc:SkillCategory) WHERE id(sc) = {scid} 
//                 CREATE (s:Skill {skill})-[r:BELONGS_TO]->(sc) 
//                 RETURN s`; 
// db.query(cypher, {scid: 286, skill: {name: 'Java'}})
//     .then((skill) => {
//         console.log("skill", skill);
//     })
//     .catch((err) => {
//         console.log("err", err)
//     });

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
