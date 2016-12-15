'use strict'
const BaseDa = require('./base-da');
const model = require('../models/models').client;

class ClientDa extends BaseDa{
    constructor(tx){
        super(model, tx);
    }
    upsert(data){
        return super.upsert(data, ["phonelistId"], false);
    }

    findByTerm(term, limit){
        let query = {name: {$ilike: `%${term}%`}};
        if(limit)
            query.paged = {skip: 0, limit: limit};
        
        query.orderBy = "name ASC";

        return this.find(query);
    }

    findOrCreate(name){
        return this.findOne({name: {$ilike: `${name}`}})
            .then(client => {
                if(client)
                    return client;
                return this.create({name: name, phonelistId: null});
            });
    }
}

module.exports = ClientDa;