'use strict'
const _ = require('lodash');
const db = require('./db');
const Joi = require('joi');
const errors = require('../shared/errors');
const P = require('bluebird');

class BaseDa {
    constructor(labels){
        if(!labels){
            this._labels = [];
        } else if(!Array.isArray(labels)){
            this._labels = [labels];
        } else{
            this._labels = labels;
        }
        this._tx = null;
    }
    _validate(data, schema){
        let options = schema._options || {stripUnknown: true};
        let errorMessage = schema._errorMessage || "Validation error";
        var result = Joi.validate(data, schema, options);
		if(result.error)
            return P.reject(new errors.GenericError(errorMessage + "(" + result.error + ")"));
		return P.resolve(result.value);
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
    _getLabelCypher(){
        let aux = [""].concat(this._label);
        return aux.join(':');
    }
    // find(id){
    //     let cypher = `MATCH (n:${this._label}) 
    //                     WHERE id(n) = {id}
    //                     RETURN n`; 
    //     return this._db().query(cypher, {id: id})
    //             .then(result => {
    //                 if(result.length == 0)
    //                     return null;
    //                 return result[0];
    //             });
    // }
    // findAll(query){
    //     let where = this._getWhere(query);
    //     let cypher = `MATCH (n:${this._label}) 
    //                     ${where}
    //                     RETURN n`;
    //     return this._db().query(cypher);
    // }
    // save(data, label){
    //     label = label || this._label;
    //     return this._db().save(data);
    // }
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
    create(data){
        let labelStr = this._getLabelCypher();
        let cypher = `CREATE (n${labelStr} {data}) 
                        RETURN n`;
        let session = this._session();
        return this._run(cypher, {data: data})
            .then(r => {
                let node = {id: r.records[0]._fields[0].identity.low};
                return _.merge(node, data);
            });
    }
    update(data){
        let dataAux = _.omit(data, ['id']);
        let labelStr = this._getLabelCypher(this._label);
        let cypher = `MATCH (n${labelStr}) WHERE ID(n) = {id} 
                      SET n += {data}
                        RETURN n`;
        return this._run(cypher, {id: data.id, data: dataAux});
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
    update(data, replace){

    }
    //force: if true delete relations before
    delete(id, force){
        
    }
    enlistTx(tx){
        this._tx = tx;
    }
    delistTx(){
        this._tx = null;
    }
    
}

module.exports = BaseDa;