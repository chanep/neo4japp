'use strict'
const BaseDa = require('./base-da');
const model = require('./models').department;

class DepartmentDa extends BaseDa{
    constructor(tx){
        super(model, tx);
    }
}

module.exports = DepartmentDa;