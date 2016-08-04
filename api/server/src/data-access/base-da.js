'use strict'
const _ = require('lodash');
const neo4j = require('neo4j-driver').v1;
const db = require('./db');
const Joi = require('joi');
const errors = require('../shared/errors');
const P = require('bluebird');

class BaseDa {
    constructor(labels, schema){
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
        this._tx = null;
        
    }
    _validateSchema(data, schema){
        let options = schema._options || {stripUnknown: true};
        let errorMessage = schema._errorMessage || "Validation error";
        var result = Joi.validate(data, schema, options);
		if(result.error)
            return P.reject(new errors.GenericError(errorMessage + "(" + result.error + ")"));
		return P.resolve(result.value);
    }
    _validate(data){
        if(!this._schema)
            return P.resolve(data);
        return this._validateSchema(data, this._schema);
    }
    _getWhereCypher(query, alias){
        alias = alias || 'n'; 
        let conditions = [];
        for(let k in query){
            let value = query[k];
            if(typeof value === 'string' && value.indexOf('*') >= 0){
                value = value.replace(/\*/g, '.*');
                conditions.push(`${alias}.${k} =~ '(?i)${value}'`);
            } else{
                conditions.push(`${alias}.${k} = ${value}`);
            }
        }

        let cypher = " WHERE " + conditions.join(' AND ');
        return cypher;
    }
    _getSetCypher(data, alias){
        alias = alias || 'n'; 
        let conditions = [];
        for(let k in data){
            let value = data[k];
            if(k != 'id'){

            }
            if(typeof value === 'string' && value.indexOf('*') >= 0){
                value = value.replace(/\*/g, '.*');
                conditions.push(`${alias}.${k} =~ '(?i)${value}'`);
            } else{
                conditions.push(`${alias}.${k} = ${value}`);
            }
        }

        let cypher = " WHERE " + conditions.join(' AND ');
        return cypher;
    }
    _toEntity(result){
        var entities = [];
        result.records.forEach(r => {
            let f = r._fields[0];
            let e = {id: f.identity.low};
            _.merge(e, f.properties);
            entities.push(e);
        })
        if(entities.length == 0){
            return null;
        } else if(entities.length == 1){
            return entities[0];
        } else{
            return entities;
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
    _run(cypher, params) {
        let session = this._session();
        var p = session.run(cypher, params)
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
        let cypher = `MATCH (n${this._labelCypher}) 
                        WHERE id(n) = {id}
                        RETURN n`; 
        return this._run(cypher, {id: id})
                .then(this._toEntity);
    }
    findAll(query){
        let where = this._getWhereCypher(query);
        let cypher = `MATCH (n${this._labelCypher}) 
                        ${where}
                        RETURN n`;
        return this._db().query(cypher);
    }
    create(data){
        let cypher = `CREATE (n${this._labelCypher} {data}) 
                        RETURN n`;
        return this._validate(data)
            .then(d => {
                return this._run(cypher, {data: d})
            })
            .then(this._toEntity);
    }
    update(data){
        let dataAux = _.omit(data, ['id']);
        let cypher = `MATCH (n${this._labelCypher}) WHERE ID(n) = {id} 
                      SET n += {data}
                        RETURN n`;
        return this._validate(data)
            .then(d => {
                this._run(cypher, {id: data.id, data: dataAux})
            })
            .then(this._toEntity);
    }
    //force: if true delete relations before
    delete(id, force){
        let cypher = `
            MATCH (n${this._labelCypher}) WHERE ID(n) = {id} 
            DELETE n
            RETURN count(n) as affected`;
        if(force){
            cypher = `
                MATCH (n${this._labelCypher}) WHERE ID(n) = {id} 
                OPTIONAL MATCH (n${this._labelCypher})-[r]-() WHERE ID(n) = {id} 
                DELETE n,r
                RETURN count(n) as affected`;
        }
        
        return this._run(cypher, {id: id})
            .then(this._toEntity);
    }
    createAndRelate(data, otherId, relName, relData, ingoing){
        let dir1 = '';
        let dir2 = '>';
        if(ingoing){
            dir1 = '<';
            dir2 = '';
        }
        relData = relData || {};
        let cypher = `
            MATCH (m) WHERE id(m) = {otherId}
            CREATE (n${this._labelCypher} {data})${dir1}-[r:${relName} {relData}]-${dir2}(m)
            RETURN n`
        let params = {otherId: neo4j.int(otherId), data: data, relData: relData};

        return this._run(cypher, params)
            .then(this._toEntity);
    }
    enlistTx(tx){
        this._tx = tx;
    }
    delistTx(){
        this._tx = null;
    }
    
}

module.exports = BaseDa;