'use strict'
const BaseDa = require('./base-da');
const model = require('../models/models').position;

class PositionDa extends BaseDa{
    constructor(tx){
        super(model, tx);
    }
}

module.exports = PositionDa;