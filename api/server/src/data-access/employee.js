'use strict'
const BaseDa = require('./base-da');
const model = require('./models').employee;

class EmployeeDa extends BaseDa{
    constructor(tx){
        super(model, tx);
    }
    setOffice(id, officeId){
        return this.relate(id, officeId, 'office', null, true);
    }
    setDepartment(id, departmentId){
        return this.relate(id, departmentId, 'department', null, true);
    }
    setPostion(id, positionId){
        return this.relate(id, positionId, 'position', null, true);
    }
}

module.exports = EmployeeDa;