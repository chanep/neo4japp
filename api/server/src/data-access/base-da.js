'use strict'
const _ = require('lodash');
const neo4j = require('neo4j-driver').v1;
const db = require('./db');
const config = require('../shared/config').db;
const Joi = require('joi');
const errors = require('../shared/errors');
const P = require('bluebird');
const Cypher = require('./cypher/cypher-helper');



class BaseDa {
    constructor(model, tx){
        this.model = model;
        this.labelsStr = model.labelsStr;
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
        let schema = this.model.schema;
        let schemaName = this.model.name;
        if(onlyDataKeys){
            schema = _.pick(schema, _.keys(data));
        }
        return this._validateSchema(data, schema, schemaName)
            .catch(err => {
                throw new errors.GenericError("Error validating model data: " + JSON.stringify(data), err);
            });
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
            console.log("Command:\n" + cmd);
            console.log("\nParams:", params);
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
    findById(id, includes) {
        try {
            if (!id) {
                return P.reject(new errors.GenericError("Must specify id in findById"));
            }
            let cypher = this._cypher.findByIdCmd(id, includes);
            return this._run(cypher.cmd, cypher.params)
                .then(r => this._cypher.parseResult(r))
                .catch(err => { throw new errors.GenericError("Error finding by id " + this.model.name, err) });
        } catch (err) {
            return P.reject(new errors.GenericError("Error finding by id " + this.model.name, err));
        }
    }
    findOne(query){
        return this.find(query)
            .then(list => {
                if(list.length == 0){
                    return null;
                } else {
                    return list[0];
                }
        });
    }
    /*
        Simple Query Structure
        ----------------------
            query = {
                key1: value1,
                key2: value2,
            }
            Will match nodes with (key1 = value1 AND key2 = value2)
        
        Operators
        ---------
        $or:[{key1: value1}, {key2: value2}]    -> (key1=value1 OR key2=value2)   
        $not:{key1: vaalue1, key2: value2}      -> NOT(key1=value1 AND key2=value2)     
        key1:{$in:[3,4,5]}                      -> (key1 IN [3,4,5])
        key1:{$ne: value1}                      -> (key1 <> value1)
        key1:{$like: '%abc%'}                   -> (key1 CONTAINS 'abc')
        key1:{$ilike: '%abc%'}                  -> case insensitive version of $like 
        key1:{$lt: 10}                          -> (key1 < 10)
        key1:{$lte: 10}                         -> (key1 <= 10)
        key1:{$gt: 10}                          -> (key1 > 10)
        key1:{$gte: 10}                         -> (key1 >= 10)
        children: {$relExists : true}           -> match objects that have at least 1 child. "children" is the relationship key defined in object Model
        children: {$relExists : false}          -> match objects that are not related with any child. "children" is the relationship key defined in object Model

        Includes
        --------------
        Includes related objects in the query result

            Simple form
            -----------
            query = {
                includes: ["child1", "child2"]
            }
            Will include the model related objects defined in relationships "child1" and "child2"

            Complete form
            -------------
            query = {
                includes:[
                    {key: "knowledges", relQuery: {level: {$lt: 3}}, notInclude: true, query: {name: 'php'}, includes: ["group"]}
                ]
            }
            key: the key (name) of the relationship
            relQuery: the query criteria for the actual relationship data (only for relationships that have data)
            query: the query criteria for the related object
            includes: includes can have subincludes
            notInclude: Applies include query criterias but doesn't include the related object in the result
        
        Pagination
        ----------
        query = {
            key1: value1
            paged: {skip: 100, limit: 10}
        }
        result = {
            data : [....]
            paged: {skip:100, limit:10, totalCount: 2000}
        }

        Ordering
        --------
        query = {
            key1: value1
            orderBy: "key1 ASC, child.key2 DESC"
        }
        order first by key asc and then by key2 of child DESC

        Query example:
        {
            id: 4,
            username: 'estebanc',
            email: {$like: '%.com'},
            $or: [{fullname: 'juan'}, {fullname: 'pepe'}],
            office: {$relExists: false}, //return employess with no office
            birth: new Date(),
            includes: [
                {key: "knowledges", relQuery: {level: {$lt: 3}}, query: {name: "PHP"}, includes: ["group"]},
                {key: "department", notInclude: true, query: {name: {$ilike: '%NOLOGY%'}}}
            ]
        };
    */
    find(query){
        try {
            query = query || {};
            let includes = query.includes || [];
            if (query.paged)
                return this._findPaged(query);
            let cypher = this._cypher.findCmd(query);
            return this._run(cypher.cmd, cypher.params)
                .then(r => this._cypher.parseResultArray(r))
                .catch(err => { throw new errors.GenericError("Error finding " + this.model.name, err) });
        } catch (err) {
            return P.reject(new errors.GenericError("Error finding " + this.model.name, err));
        }
    }
    _findPaged(query){
        try{
            query = query || {};
            let includes = query.includes || [];
            let cypher = this._cypher.findCmd(query);
            let totalCount;
            return this.count(query)
                .then(c => {
                    totalCount = c;
                    return this._run(cypher.cmd, cypher.params)
                })
                .then(r => this._cypher.parseResultArray(r))
                .then(data => {
                    let paged = _.clone(query.paged);
                    paged.totalCount = totalCount;
                    return {
                        data: data,
                        paged: paged
                    };
                })
                .catch(err => {throw new errors.GenericError("Error finding paged " + this.model.name, err)});
        } catch(err){
            return P.reject(new errors.GenericError("Error finding paged " + this.model.name, err))
        }
    }
    count(query){
        try{
            query = query || {};
            let includes = query.includes || [];
            let cypher = this._cypher.countCmd(query);
            return this._run(cypher.cmd, cypher.params)
                .then(r => this._cypher.parseIntResult(r))
                .catch(err => {throw new errors.GenericError("Error counting " + this.model.name, err)});
        } catch(err){
            return P.reject(new errors.GenericError("Error counting " + this.model.name, err))
        }
    }

    /**
     * Executes a raw cypher query
     * @param {String} cmd - Cypher command
     * @param {String} params - Command parameters
     * @param {Object} [schema] - Optional Joi schema of the result 
     */
    query(cmd, params, schema){
        return this._run(cmd, params)
                .then(r => this._cypher.parseResultArrayRaw(r, schema));
                // .then(n => this._toEntityArray(n));
    }
    /**
     * Executes a raw cypher paged query
     * @param {String} cmd - Cypher command
     * @param {any} countCmd - Cypher command for counting the total number of records used for paging
     * @param {String} params - Command parameters
     * @param {Object} [schema] - Optional Joi schema of the result 
     */
    queryPaged(cmd, countCmd, params, schema){
        let countParams = _.omit(params, ["skip", "limit"]);
        let paged = {
            skip: params.skip,
            limit: params.limit
        };
        return this._run(countCmd, countParams)
                .then(r => {
                    paged.totalCount = this._cypher.parseIntResult(r);
                    return this._run(cmd, params)
                })
                .then(r => {
                    let result = {};
                    result.data = this._cypher.parseResultArrayRaw(r, schema);
                    result.paged = paged;
                    return result;
                });
    }
    create(data){
        return this._validate(data)
            .then(d => {
                let cypher = this._cypher.createCmd(d);
                return this._run(cypher.cmd, cypher.params);
            })
            .then(r => this._cypher.parseResult(r))
            .catch(err => {throw new errors.GenericError("Error creating " + this.model.name, err)});
    }
    
    /**
     * Updates node
     * @param {Object} data
     * @param {boolean} mergeKeys - if true, updates set only data keys, if false, updates overwrites the whole node with passed data
     * @returns updated node
     */
    update(data, mergeKeys){
        return this._validate(data, mergeKeys)
            .then(d => {
                let cypher = this._cypher.updateCmd(d, mergeKeys);
                return this._run(cypher.cmd, cypher.params);
            })
            .then(r => this._cypher.parseResult(r))
            .catch(err => {throw new errors.GenericError("Error updating " + this.model.name, err)});
    }
    /**
     * Updates if node exists (based on iniqueKeys) or creates if node doesn't exists
     * @param {Object} data
     * @param {Array} uniqueKeys - Keys of the object used to decide if the object exists and should be updated or it doesn't exists and should be created'
     * @param {Boolean} mergeKeys - when updating, if true, merges data keys with db object keys. If false overwrites the entire db object with data
     * @returns {Object} {data: {...}, created: true} or {data: {...}, updated: true}
     */
    upsert(data, uniqueKeys, mergeKeys){
        if(!uniqueKeys)
            return P.reject(new errors.GenericError(`uniqueKeys undefined in upsert`));
        if(typeof uniqueKeys == 'string')
            uniqueKeys = [uniqueKeys];
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
    /**
     * Deletes a node
     * @param {Number} id
     * @param {Boolean} force - if true, deletes also object relationships
     * @returns Affected records count
     */
    delete(id, force) {
        try {
            let cypher = this._cypher.deleteCmd(id, force);
            return this._run(cypher.cmd, cypher.params)
                .then(r => this._cypher.parseResultAffected(r))
                .catch(err => { throw new errors.GenericError("Error deleting " + this.model.name, err) });
        } catch (err) {
            return P.reject(new errors.GenericError("Error deleting " + this.model.name, err))
        }
    }
    /**
     * Deletes all nodes of this type
     * @returns Affected records count
     */
    deleteAll() {
        try {
            let cypher = this._cypher.deleteAllCmd();
            return this._run(cypher.cmd, cypher.params)
                .then(r => this._cypher.parseResultAffected(r))
                .catch(err => { throw new errors.GenericError("Error deleting all " + this.model.name, err) });
        } catch (err) {
            return P.reject(new errors.GenericError("Error deleting all " + this.model.name, err))
        }
    }
    /**
     * Relate 2 existing nodes
     * @param {Number} selfId
     * @param {Number} otherId
     * @param {String} relKey - name of the relationship
     * @param {Object} [relData] - data of the actual relationships if applies
     * @param {Boolean} mergeKeys - when updating, if true, merges data keys with db object keys. If false overwrites the entire db object with data
     * @returns Relationship data
     */
    relate(selfId, otherId, relKey, relData, mergeKeys){
        if(!selfId)
            return P.reject(new errors.GenericError(`BaseDa.relate selfId undefined`));
        if(!otherId)
            return P.reject(new errors.GenericError(`BaseDa.relate otherId undefined`));
        return this._validateRelationship(relData, relKey)
            .then(d => {
                let cypher = this._cypher.relateCmd(selfId, otherId, relKey, d, mergeKeys);
                return this._run(cypher.cmd, cypher.params);
            })
            .then(r => this._cypher.parseResultRaw(r, null))
            .catch(err => {throw new errors.GenericError("Error relating " + this.model.name, err)});
    }
    /**
     * Delete a relationship between 2 nodes
     * @param {Number} selfId
     * @param {Number} otherId
     * @param {String} relKey - name of the relationship
     * @returns Relationships affected count
     */
    deleteRelationship(selfId, otherId, relKey){
        if(!selfId)
            return P.reject(new errors.GenericError(`BaseDa.deleteRelationship selfId undefined`));
        if(!otherId)
            return P.reject(new errors.GenericError(`BaseDa.deleteRelationship otherId undefined`));

        let cypher = this._cypher.deleteRelationshipCmd(selfId, otherId, relKey);
        return this._run(cypher.cmd, cypher.params)
            .then(r => this._cypher.parseResultAffected(r))
            .catch(err => {throw new errors.GenericError(`Error deleteing relationship ${relKey} of ${this.model.name}`, err)});
    }

    /**
     * Updates relationship data
     * @param {Number} relId - Relationship id
     * @param {any} relKey - Relationship name
     * @param {any} relData - data of the actual relationships
     * @param {Boolean} mergeKeys - when updating, if true, merges data keys with db object keys. If false overwrites the entire db object with data
     * @returns Relationship data
     */
    updateRelationship(relId, relKey, relData, mergeKeys){
        if(!relId)
            return P.reject(new errors.GenericError(`BaseDa.updateRelationship relId undefined`));
        return this._validateRelationship(relData, relKey)
            .then(d => {
                let cypher = this._cypher.updateRelationshipCmd(relId, relKey, relData, mergeKeys);
                return this._run(cypher.cmd, cypher.params);
            })
            .then(r => this._cypher.parseResultRaw(r, null))
            .catch(err => {throw new errors.GenericError("Error updating relationship " + this.model.name, err)});
    }
    /**
     * Check the existence of a relationship
     * @param {number} selfId
     * @param {string} relKey
     * @param {number} otherId - Related node id (if null: checks the existence of the relationship with any other node)
     */
    relationshipExists(selfId, relKey, otherId){
        try {
            let cypher = this._cypher.relationshipExistsCmd(selfId, relKey, otherId);
            return this._run(cypher.cmd, cypher.params)
                .then(r => this._cypher.parseResultRaw(r, null))
                .catch(err => { throw new errors.GenericError("Error checking if relationship exists " + this.model.name, err) });
        } catch (err) {
            return P.reject(new errors.GenericError("Error checking if relationship exists " + this.model.name, err))
        }
    }
    /**
     * Creates a node and relates to other node in the same command
     * @param {Object} data - Node data
     * @param {any} otherId - Id of the node to relate with
     * @param {any} relKey - Relationship name
     * @param {Object} [relData] - data of the actual relationships if applies
     * @returns Relationship data
     */
    createAndRelate(data, otherId, relKey, relData) {
        try {
            let cypher = this._cypher.createAndRelateCmd(data, otherId, relKey, relData);
            return this._run(cypher.cmd, cypher.params)
                .then(r => this._cypher.parseResult(r))
                .catch(err => { throw new errors.GenericError("Error creating and relating " + this.model.name, err) });
        } catch (err) {
            return P.reject(new errors.GenericError("Error creating and relating " + this.model.name, err))
        }
    }
    /**
     * Deletes all relationships of specified type
     * @param {Number} id - node id
     * @param {any} relKey - relationship name
     * @returns
     */
    deleteAllRelationships(id, relKey) {
        try {
            if(!id)
                throw new errors.GenericError(`BaseDa.deleteAllRelationships id undefined`);
            let cypher = this._cypher.deleteAllRelationshipsCmd(id, relKey);
            return this._run(cypher.cmd, cypher.params)
                .then(r => this._cypher.parseResultAffected(r))
                .catch(err => { throw new errors.GenericError("Error deleting all relationships " + this.model.name, err) });
        } catch (err) {
            return P.reject(new errors.GenericError("Error deleting all relationships " + this.model.name, err))
        }
    }

    /**
     * Creates or replace a child node. This model must be the owner of the child
     * which means the child can't exists without the owner
     * @param {number} selfId - This model id
     * @param {string} relKey - Relationship key. Must be a one to one relationship
     * @param {object} childData
     * @returns {object} child node
     */
    setChild(selfId, relKey, childData){
        try {
            let r = this.model.getRelationByKey(relKey);
            if(!r.isToOne())
                throw new errors.GenericError("Relation is not One to One");
            let cypher = this._cypher.setChildCmd(selfId, relKey, childData);
            return this._run(cypher.cmd, cypher.params)
                .then(r => this._cypher.parseResult(r, r.model))
                .catch(err => { throw new errors.GenericError("Error setting child node of " + this.model.name, err) });
        } catch (err) {
            return P.reject(new errors.GenericError("Error setting child node of " + this.model.name, err))
        }
    }
     /**
     * Adds a new child node of a one to many relationship. This model must be the owner of the child
     * which means the child can't exists without the owner
     * @param {number} selfId - This model id
     * @param {string} relKey - Relationship key. Must be a one to many relationship
     * @param {object} childData
     * @returns {object} child node
     */
    addChild(selfId, relKey, childData){
        try {
            let r = this.model.getRelationByKey(relKey);
            if(!r.isToMany())
                throw new errors.GenericError("Relation is not x to Many");
            let cypher = this._cypher.addChildCmd(selfId, relKey, childData);
            return this._run(cypher.cmd, cypher.params)
                .then(r => this._cypher.parseResult(r, r.model))
                .catch(err => { throw new errors.GenericError("Error adding child node of " + this.model.name, err) });
        } catch (err) {
            return P.reject(new errors.GenericError("Error adding child node of " + this.model.name, err))
        }
    }
    /**
     * Updates a child node of relationship. This model must be the owner of the child
     * which means the child can't exists without the owner. 
     * @param {number} selfId - This model id
     * @param {string} relKey - Relationship key
     * @param {object} childData - id must be defined
     * @returns {object} child node
     */
    updateChild(slefId, relKey, childData){
        try {
            if(!childData.id)
                throw new errors.GenericError("Child id must be defined");
            let cypher = this._cypher.updateChild(selfId, relKey, childData);
            return this._run(cypher.cmd, cypher.params)
                .then(r => this._cypher.parseResult(r, r.model))
                .catch(err => { throw new errors.GenericError("Error update child node of " + this.model.name, err) });
        } catch (err) {
            return P.reject(new errors.GenericError("Error update child node of " + this.model.name, err))
        }
    }
    /**
     * Enlist this data acces object in an existing transaction. All commands will be part of the transaction
     * @param {any} tx
     */
    enlistTx(tx){
        this._tx = tx;
    }
    delistTx(){
        this._tx = null;
    }
    
}

module.exports = BaseDa;