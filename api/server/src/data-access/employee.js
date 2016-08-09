'use strict'
const BaseDa = require('./base-da');

class EmployeeDa extends BaseDa{
    constructor(tx){
        super(tx, 'Employee');
    }
    setOffice(id, officeId){
        return this.relate(id, officeId, 'OF_OFFICE', null, false, true);
    }
    setDepartment(id, departmentId){
        return this.relate(id, departmentId, 'OF_DEPARTMENT', null, false, true);
    }
    setPostion(id, positionId){
        return this.relate(id, positionId, 'OF_POSITION', null, false, true);
    }
}

module.exports = EmployeeDa;