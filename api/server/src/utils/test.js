'use strict'
var path = require('path');
var envFile = path.resolve(__dirname, "../.env");
require('dotenv').config({path: envFile});

var db = require('../data-access/db');


// var session  = db.session();
// var cypher = `MATCH (n), (m) where ID(n) = 290 AND ID(m)=292 RETURN n, m`

// session.run(cypher)
//     .then(r => {
//         console.log(JSON.stringify(r))
//     })

const SkillGroupDa = require('../data-access/skill-group');
var da = new SkillGroupDa();

let sg1, sg2;

// da.create({name: "grupo31"})
//     .then(sg => {
//         console.log("sg1", sg);
//         sg1 = sg;
//         return da.create({name: "grupo32"})
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

da.relate(349, 350, "HAS", {relKey: "relValue2"}, false)
    .then(console.log)
    .catch(console.error);

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

