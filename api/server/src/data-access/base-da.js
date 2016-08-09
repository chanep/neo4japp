'use strict'
const _ = require('lodash');
const neo4j = require('neo4j-driver').v1;
const db = require('./db');
const config = require('../shared/config').db;
const Joi = require('joi');
const errors = require('../shared/errors');
const P = require('bluebird');
const cypher = require('./cypher-helper');



class BaseDa {
    constructor(tx, labels, schema){
        if(!labels){
            this._labels = [];
        } else if(!Array.isArray(labels)){
            this._labels = [labels];
        } else{
            this._labels = labels;
        }
        let aux = [""].concat(this._labels);
        this._labelCypher = aux.join(':');

        this._schema = schema;
        this._tx = tx;
        
    }
    _validateSchema(data, schema){
        let options = schema._options || {stripUnknown: true};
        let errorMessage = schema._errorMessage || "Validation error";
        var result = Joi.validate(data, schema, options);
		if(result.error)
            return P.reject(new errors.GenericError(errorMessage + "(" + result.error + ")"));
		return P.resolve(result.value);
    }
    _validate(data, onlyDataKeys){
        if(!this._schema)
            return P.resolve(data);
        let schema = this._schema;
        if(onlyDataKeys){
            schema = _.pick(schema, _.keys(data));
        }
        return this._validateSchema(data, schema, onlyDataKeys);
    }
    _nonNativeKeys(){
        return {};
    }
    _session(){
        return this._tx || db.session();
    }
    _disposeSession(session){
        if(!this._tx)
            session.close();
        // if(this._tx){
        //     return P.resolve();
        // } else{
        //     return session.close()
        // }     
    }
    _logCmd(cmd, params){
        if(config.logCommands){
            console.log("----------------------");
            console.log("Command: ", cmd);
            console.log("params: ", params);
            console.log("----------------------");
        }
    }
    _run(cmd, params) {
        let session = this._session();
        this._logCmd(cmd, params);
        var p = session.run(cmd, params)
            .then(result => {
                this._disposeSession(session);
                return result;
            })
            .catch(err =>{
                throw new errors.GenericError("db command error: " + JSON.stringify(err), err);
            });
        return this._wrapPromise(p);
    }
    _wrapPromise(promise) {
        return new P(function (resolve, reject) {
            promise.then(function (result) {
                resolve(result);
            }, function (err) {
                reject(err);
            });
        });
    }
    _toEntity(node){
        let entity = _.clone(node);
        let nonNative = this._nonNativeKeys();
        for(let k in nonNative){
            if(node[k]){
                let type = nonNative[k];
                switch(type){
                    case "date":
                        entity[k] = new Date(node[k]);
                        break;
                    case "object":
                        entity[k] = JSON.parse(node[k]);
                        break;                   
                }
            }
        }
        return entity;
    }
    _toEntityArray(nodes){
        return nodes.map(n => this._toEntity(n));
    }
    _toNode(entity){
        let node = _.clone(entity);
        let nonNative = this._nonNativeKeys();
        for(let k in nonNative){
            if(node[k]){
                let type = nonNative[k];
                switch(type){
                    case "date":
                        node[k] = entity[k].getTime();
                        break;
                    case "object":
                        node[k] = JSON.stringify(entity[k]);
                        break;                   
                }
            }
        }
        return node;
    }
    findById(id){
        let cmd = `MATCH (n${this._labelCypher}) 
                        WHERE id(n) = {id}
                        RETURN n`; 
        return this._run(cmd, {id: id})
                .then(r => cypher.parseResult(r))
                .then(n => this._toEntity(n));
    }
    find(query){
        let where = cypher.getWhere(query);
        let cmd = `MATCH (n${this._labelCypher}) 
                        ${where}
                        RETURN n`;
        return this._run(cmd)
                .then(r => cypher.parseResultArray(r))
                .then(n => this._toEntityArray(n));
    }
    query(cmd){
        return this._run(cmd);
                // .then(r => cypher.parseResultArray(r))
                // .then(n => this._toEntityArray(n));
    }
    create(data){
        let cmd = `CREATE (n${this._labelCypher} {data}) 
                        RETURN n`;
        return this._validate(data)
            .then(d => {
                return this._run(cmd, {data: this._toNode(d)})
            })
            .then(r => cypher.parseResult(r))
            .then(n => this._toEntity(n));
    }
    update(data, mergeKeys){
        let dataAux = _.omit(data, ['id']);
        let operator = mergeKeys? '+=' : '=';
        let cmd = `MATCH (n${this._labelCypher}) WHERE ID(n) = {id} 
                      SET n ${operator} {data}
                        RETURN n`;
        return this._validate(data, true)
            .then(d => {
                return this._run(cmd, {id: neo4j.int(data.id), data: this._toNode(dataAux)})
            })
            .then(r => cypher.parseResult(r))
            .then(n => this._toEntity(n));
    }
    upsert(data, mergeKeys, uniqueKeys){
        let query = _.pick(data, uniqueKeys);
        return this.find(query)
            .then(entities => {
                if(entities.length > 1){
                    throw new errors.GenericError(`keys ${uniqueKeys} must be unique. Matching entities ${JSON.stringify(entities)}`);
                }
                else if(entities.length == 0){
                    return this.create(data)
                        .then(e => {return {data: e, created: true}});
                } else{
                    data.id = entities[0].id;
                    return this.update(data, mergeKeys)
                        .then(e => {return {data: e, updated: true}});
                }
            });
    }
    //force: if true delete relations before
    delete(id, force){
        let cmd = `
            MATCH (n${this._labelCypher}) WHERE ID(n) = {id} 
            DELETE n
            RETURN count(n) as affected`;
        if(force){
            cmd = `
                MATCH (n${this._labelCypher}) WHERE ID(n) = {id} 
                OPTIONAL MATCH (n${this._labelCypher})-[r]-() WHERE ID(n) = {id} 
                DELETE n,r
                RETURN count(n) as affected`;
        }
        
        return this._run(cmd, {id: id});
    }
    relate(id, otherId, relName, relData, ingoing, replace){
        let dir1 = '';
        let dir2 = '>';
        if(ingoing){
            dir1 = '<';
            dir2 = '';
        }
        relData = relData || {};
        let relDataStr = cypher.mapToStr(relData, "relData");
        let cmd = `
            MATCH (n${this._labelCypher}),(m)
            WHERE ID(n) = {id} AND ID(m) = {otherId}
            MERGE (n)${dir1}-[r:${relName} ${relDataStr}]-${dir2}(m)
            RETURN r`;

        if(replace){
            cmd = `
                MATCH (n${this._labelCypher}),(m)
                WHERE ID(n) = {id} AND ID(m) = {otherId}
                CREATE UNIQUE (n)${dir1}-[r:${relName}]-${dir2}(m)
                SET r = {relData}
                RETURN r`;
        }
        
        let params = {id: neo4j.int(id), otherId: neo4j.int(otherId), relData: relData};

        return this._run(cmd, params)
            .then(r => cypher.parseResult(r));
    }
    createAndRelate(data, otherId, relName, relData, ingoing){
        let dir1 = '';
        let dir2 = '>';
        if(ingoing){
            dir1 = '<';
            dir2 = '';
        }
        relData = relData || {};
        let cmd = `
            MATCH (m) WHERE ID(m) = {otherId}
            CREATE (n${this._labelCypher} {data})${dir1}-[r:${relName} {relData}]-${dir2}(m)
            RETURN n`
        let params = {otherId: neo4j.int(otherId), data: this._toNode(data), relData: relData};

        return this._run(cmd, params)
            .then(r => cypher.parseResult(r))
            .then(n => this._toEntity(n));
    }
    enlistTx(tx){
        this._tx = tx;
    }
    delistTx(){
        this._tx = null;
    }
    
}

module.exports = BaseDa;