'use strict'
const db = require('./db');
const Joi = require('joi');
const errors = require('../shared/errors');
const P = require('bluebird');

class BaseDa {
    constructor(label){
        this._label = label;
        this._tx = null;
    }
    _db(){
        return this._tx || db;
    }
    _validate(data, schema){
        let options = schema._options || {stripUnknown: true};
        let errorMessage = schema._errorMessage || "Validation error";
        var result = Joi.validate(data, schema, options);
		if(result.error)
            return P.reject(new errors.GenericError(errorMessage + "(" + result.error + ")"));
		return P.resolve(result.value);
    }
    _getWhere(query, alias){
        alias = alias || 'n'; 
        let conditions = [];
        for(let k in query){
            let value = query[k];
            if(typeof value === 'string' && value.indexOf('*') >= 0){
                value = value.replace(/\*/g, '.*');
                conditions.push(`${alias}.${k} =~ '${value}'`);
            } else{
                conditions.push(`${alias}.${k} = ${value}`);
            }
        }

        let cypher = " WHERE " + conditions.join(' AND ');
        return cypher;
    }
    find(id){
        let cypher = `MATCH (n:${this._label}) 
                        WHERE id(n) = {id}
                        RETURN n`; 
        return this._db().query(cypher, {id: id})
                .then(result => {
                    if(result.length == 0)
                        return null;
                    return result[0];
                });
    }
    findAll(query){
        let where = this._getWhere(query);
        let cypher = `MATCH (n:${this._label}) 
                        ${where}
                        RETURN n`;
        return this._db().query(cypher);
    }
    save(data, label){
        label = label || this._label;
        return this._db().save(data, label);
    }
    //force: if true delete relations before
    delete(id, force){
        return this._db().delete(id, force);
    }
    enlistTx(tx){
        this._tx = tx;
    }
    delistTx(){
        this._tx = null;
    }
    
}

module.exports = BaseDa;