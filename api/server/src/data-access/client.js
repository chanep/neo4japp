'use strict'
const BaseDa = require('./base-da');
const model = require('../models/models').client;

class ClientDa extends BaseDa{
    constructor(tx){
        super(model, tx);
    }
    upsert(data){
        return super.upsert(data, ["phonelistId"], true);
    }
}

module.exports = ClientDa;