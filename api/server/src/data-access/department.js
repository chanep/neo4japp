'use strict'
const BaseDa = require('./base-da');

class DepartmentDa extends BaseDa{
    constructor(tx){
        super(tx, 'Department');
    }
}

module.exports = DepartmentDa;