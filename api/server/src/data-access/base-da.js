'use strict'
const _ = require('lodash');
const neo4j = require('neo4j-driver').v1;
const db = require('./db');
const config = require('../shared/config').db;
const Joi = require('joi');
const errors = require('../shared/errors');
const P = require('bluebird');
const Cypher = require('./cypher-helper');



class BaseDa {
    constructor(model, tx){
        this.model = model;
        this._cypher = new Cypher(model);
        this._tx = tx;
        
    }
    _validateSchema(data, schema, schemaName){
        let options = schema._options || {stripUnknown: true};
        let errorMessage = `Error in ${schemaName} schema`;
        var result = Joi.validate(data, schema, options);
		if(result.error)
            return P.reject(new errors.GenericError(errorMessage + "(" + result.error + ")"));
		return P.resolve(result.value);
    }
    _validate(data, onlyDataKeys){
        try{
            let schema = this.model.schema;
            let schemaName = this.model.name;
            if(onlyDataKeys){
                schema = _.pick(schema, _.keys(data));
            }
            return this._validateSchema(data, schema, schemaName);
        } catch(err){
            return P.reject(errors.GenericError("Error validating model data", err));
        }
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
    findById(id, includes){
        let cypher = this._cypher.findByIdCmd(id, includes);
        let cmd = cypher[0];
        let params = cypher[1];
        return this._run(cmd, params)
                .then(r => this._cypher.parseResult(r, includes));
    }
    find(query){
        query = query || {};
        let includes = query.includes || [];
        let cypher = this._cypher.findCmd(query);
        let cmd = cypher[0];
        let params = cypher[1];
        return this._run(cmd, params)
                .then(r => this._cypher.parseResultArray(r, includes));
    }
    query(cmd){
        return this._run(cmd);
                // .then(r => cypher.parseResultArray(r))
                // .then(n => this._toEntityArray(n));
    }
    create(data){
        return this._validate(data)
            .then(d => {
                let cypher = this._cypher.createCmd(d);
                let cmd = cypher[0];
                let params = cypher[1];
                return this._run(cmd, params);
            })
            .then(r => this._cypher.parseResult(r));
    }
    update(data, mergeKeys){
        return this._validate(data, true)
            .then(d => {
                let cypher = this._cypher.updateCmd(d, mergeKeys);
                let cmd = cypher[0];
                let params = cypher[1];
                return this._run(cmd, params)
            })
            .then(r => this._cypher.parseResult(r));
    }
    upsert(data, uniqueKeys, mergeKeys){
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
        let cypher = this._cypher.deleteCmd(id, force);
        let cmd = cypher[0];
        let params = cypher[1];  
        return this._run(cmd, params)
            .then(r => this._cypher.parseResultAffected(r));
    }
    deleteAll(){
        let cypher = this._cypher.deleteAllCmd();
        let cmd = cypher[0];
        let params = cypher[1];  
        return this._run(cmd, params)
            .then(r => this._cypher.parseResultAffected(r));
    }
    relate(id, otherId, relKey, relData, replace){
        let cypher = this._cypher.relateCmd(id, otherId, relKey, relData, replace);
        let cmd = cypher[0];
        let params = cypher[1];

        return this._run(cmd, params)
            .then(r => this._cypher.parseResult(r));
    }
    createAndRelate(data, otherId, relKey, relData){
        let cypher = this._cypher.createAndRelateCmd(data, otherId, relKey, relData);
        let cmd = cypher[0];
        let params = cypher[1];

        return this._run(cmd, params)
            .then(r => this._cypher.parseResult(r));
    }
    enlistTx(tx){
        this._tx = tx;
    }
    delistTx(){
        this._tx = null;
    }
    
}

module.exports = BaseDa;