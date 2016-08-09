'use strict'
const BaseDa = require('./base-da');

class PositionDa extends BaseDa{
    constructor(tx){
        super(tx, 'Position');
    }
}

module.exports = PositionDa;