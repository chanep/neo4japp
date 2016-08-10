'use strict'
const BaseDa = require('./base-da');
const model = require('./models').office;

class OfficeDa extends BaseDa{
    constructor(tx){
        super(model, tx);
    }
}

module.exports = OfficeDa;