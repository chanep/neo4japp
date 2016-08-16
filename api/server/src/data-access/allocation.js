'use strict'
const BaseDa = require('./base-da');
const model = require('../models/models').allocation;

class AllocationDa extends BaseDa{
    constructor(tx){
        super(model, tx);
    }
}

module.exports = AllocationDa;