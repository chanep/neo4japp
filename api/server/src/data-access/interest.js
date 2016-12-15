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
        return this.findOne({name: {$ilike: `${name}`}})
            .then(interest => {
                if(interest)
                    return interest;
                return this.create({name: name});
            });
    }
}

module.exports = InterestDa;