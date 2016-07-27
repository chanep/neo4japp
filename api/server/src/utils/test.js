'use strict'

var path = require('path');
var envFile = path.resolve(__dirname, "../.env");
require('dotenv').config({path: envFile});

var db = require('../data-access/db');



// db.save({name: 'Languages'}, 'Category', (err, r) =>{
//         console.log("err", err);
//         console.log("r", r);
// })


// db.save({name: 'Languages'}, 'SkillCategory')
//     .then((sc) => {
//         console.log("sc", sc);
//     })
//     .catch((err) => {
//         console.log("err", err)
//     });

// MATCH (n:Skill)
// OPTIONAL MATCH (n:Skill)-[r]-()
// DELETE n,r
// RETURN count(n) as deletedNodesCount

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

var cypher = `MATCH (sc:SkillCategory)<-[:BELONGS_TO*]-(s) 
                WITH sc, collect(s) as skills
                RETURN {id: id(sc), name: sc.name, skills: skills}`; 

cypher = `MATCH (sc:SkillCategory)<-[:BELONGS_TO*]-(s) 
                WITH sc, collect(s) as skills
                RETURN properties(sc, skills)`; 



db.query(cypher)
    .then((result) => {
        console.log("result", JSON.stringify(result));
    })
    .catch((err) => {
        console.log("err", err)
    });

