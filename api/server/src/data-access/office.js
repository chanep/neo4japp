'use strict'
const BaseDa = require('./base-da');

class OfficeDa extends BaseDa{
    constructor(tx){
        super(tx, 'Office');
    }
}

module.exports = OfficeDa;