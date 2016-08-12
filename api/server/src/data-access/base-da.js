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
            return P.reject(new errors.GenericError("Error validating model data: " + data, err));
        }
    }
    _validateRelationship(relData, relKey, onlyDataKeys){
        try{
            let r = this.model.getRelationByKey(relKey);
            if(!r.schema)
                return P.resolve(null);
            let schema = r.schema;
            let schemaName = r.label;
            if(onlyDataKeys){
                schema = _.pick(schema, _.keys(relData));
            }
            return this._validateSchema(relData, schema, schemaName);
        } catch(err){
            return P.reject(new errors.GenericError("Error validating relationship data", err));
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
        if(!id){
            return P.reject(new errors.GenericError("Must specify id in findById"));
        }
        let cypher = this._cypher.findByIdCmd(id, includes);
        let cmd = cypher[0];
        let params = cypher[1];
        return this._run(cmd, params)
                .then(r => this._cypher.parseResult(r, includes))
                .catch(err => {throw new errors.GenericError("Error finding by id " + this.model.name, err)});
    }
    findOne(query){
        return this.find(query)
            .then(list => {
                if(list.length == 0){
                    return null;
                } else {
                    return list[0];
                }
            })
    }
    /*
        Query example:
        {
            id: 4,
            username: 'estebanc',
            email: {$like: '%.com'},
            office: {$relExists: false}, //return employess with no office
            birth: new Date(),
            includes: [
                {key: "knowledges", relQuery: {level: {$lt: 3}}, query: {name: "PHP"}, includes: ["group"]},
                {key: "department", query: {name: {$ilike: '%NOLOGY%'}}}
            ]
        };
    */
    find(query){
        query = query || {};
        let includes = query.includes || [];
        let cypher = this._cypher.findCmd(query);
        let cmd = cypher[0];
        let params = cypher[1];
        return this._run(cmd, params)
                .then(r => this._cypher.parseResultArray(r, includes))
                .catch(err => {throw new errors.GenericError("Error finding " + this.model.name, err)});
    }
    query(cmd, params){
        return this._run(cmd, params)
                .then(r => this._cypher.parseResultArrayRaw(r));
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
            .then(r => this._cypher.parseResult(r))
            .catch(err => {throw new errors.GenericError("Error creating " + this.model.name, err)});
    }
    update(data, mergeKeys){
        return this._validate(data, true)
            .then(d => {
                let cypher = this._cypher.updateCmd(d, mergeKeys);
                let cmd = cypher[0];
                let params = cypher[1];
                return this._run(cmd, params);
            })
            .then(r => this._cypher.parseResult(r))
            .catch(err => {throw new errors.GenericError("Error updating " + this.model.name, err)});
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
            .then(r => this._cypher.parseResultAffected(r))
            .catch(err => {throw new errors.GenericError("Error deleting " + this.model.name, err)});
    }
    deleteAll(){
        let cypher = this._cypher.deleteAllCmd();
        let cmd = cypher[0];
        let params = cypher[1];  
        return this._run(cmd, params)
            .then(r => this._cypher.parseResultAffected(r))
            .catch(err => {throw new errors.GenericError("Error deleting all " + this.model.name, err)});
    }
    relate(id, otherId, relKey, relData, replace){
        return this._validateRelationship(relData, relKey)
            .then(d => {
                let cypher = this._cypher.relateCmd(id, otherId, relKey, d, replace);
                let cmd = cypher[0];
                let params = cypher[1];
                return this._run(cmd, params);
            })
            .then(r => this._cypher.parseResultRaw(r, null))
            .catch(err => {throw new errors.GenericError("Error relating " + this.model.name, err)});
    }
    createAndRelate(data, otherId, relKey, relData){
        let cypher = this._cypher.createAndRelateCmd(data, otherId, relKey, relData);
        let cmd = cypher[0];
        let params = cypher[1];

        return this._run(cmd, params)
            .then(r => this._cypher.parseResult(r))
            .catch(err => {throw new errors.GenericError("Error creating and relating " + this.model.name, err)});
    }
    enlistTx(tx){
        this._tx = tx;
    }
    delistTx(){
        this._tx = null;
    }
    
}

module.exports = BaseDa;