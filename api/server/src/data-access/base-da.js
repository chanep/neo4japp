'use strict'
const _ = require('lodash');
const neo4j = require('neo4j-driver').v1;
const db = require('./db');
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
    _run(cmd, params) {
        let session = this._session();
        var p = session.run(cmd, params)
            .then(result => {
                this._disposeSession(session);
                return result;
            });
        return this._wrapPromise(p);
    }
    _wrapPromise(promise){
        return new P(function (resolve, reject) {
            promise.then(resolve).catch(reject);
        });
    }
    find(id){
        let cmd = `MATCH (n${this._labelCypher}) 
                        WHERE id(n) = {id}
                        RETURN n`; 
        return this._run(cmd, {id: id})
                .then(cypher.toEntity);
    }
    findAll(query){
        let where = cypher.getWhere(query);
        let cmd = `MATCH (n${this._labelCypher}) 
                        ${where}
                        RETURN n`;
        return this._run(cmd)
                .then(cypher.toEntity);
    }
    create(data){
        let cmd = `CREATE (n${this._labelCypher} {data}) 
                        RETURN n`;
        return this._validate(data)
            .then(d => {
                return this._run(cmd, {data: d})
            })
            .then(cypher.toEntity);
    }
    update(data){
        let dataAux = _.omit(data, ['id']);
        let cmd = `MATCH (n${this._labelCypher}) WHERE ID(n) = {id} 
                      SET n += {data}
                        RETURN n`;
        return this._validate(data, true)
            .then(d => {
                this._run(cmd, {id: data.id, data: dataAux})
            })
            .then(cypher.toEntity);
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
        
        return this._run(cmd, {id: id})
            .then(cypher.toEntity);
    }
    relate(id, otherId, relName, relData, ingoing){
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
            RETURN r`
        let params = {id: neo4j.int(id), otherId: neo4j.int(otherId), relData: relData};

        return this._run(cmd, params)
            .then(cypher.toEntity);
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
        let params = {otherId: neo4j.int(otherId), data: data, relData: relData};

        return this._run(cmd, params)
            .then(cypher.toEntity);
    }
    enlistTx(tx){
        this._tx = tx;
    }
    delistTx(){
        this._tx = null;
    }
    
}

module.exports = BaseDa;