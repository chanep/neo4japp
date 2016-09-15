'use strict'
const BaseDa = require('./base-da');
const model = require('../models/models').interest;

class InterestDa extends BaseDa{
    constructor(tx){
        super(model, tx);
    }

    findByTerm(term, limit){
        let query = {name: {$ilike: `%${term}%`}};
        if(limit)
            query.paged = {skip: 0, limit: limit};
        
        query.orderBy = "name ASC";

        return this.find(query);
    }

    findOrCreate(name){
        let label = this.labelsStr;
        let cmd = `MERGE (n:${label} {name: {name}}) RETURN n`;
        let params = {name: name};
        return this._run(cmd, params)
            .then(r => this._cypher.parseResult(r));
    }
}

module.exports = InterestDa;