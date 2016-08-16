'use strict'
const BaseDa = require('./base-da');
const model = require('../models/models').user;
const AllocationDa = require('./allocation');

class UserDa extends BaseDa{
    constructor(tx){
        super(model, tx);
    }
    setOffice(id, officeId){
        return this.relate(id, officeId, 'office', null, true);
    }
    setDepartment(id, departmentId){
        return this.relate(id, departmentId, 'department', null, true);
    }
    setPosition(id, positionId){
        return this.relate(id, positionId, 'position', null, true);
    }
    setKnowledge(id, skillId, knowledgeData){
        return this.relate(id, skillId, 'knowledges', knowledgeData, true);
    }
    setAllocation(id, allocationData){
        let allocationDa = new AllocationDa();
        let query = {id: id, includes:["allocation"]};
        return this.findOne(query)
            .then(u => {
                if(u.allocation && u.allocation.id){
                    allocationData.id = u.allocation.id;
                    return allocationDa.update(allocationData);
                } else{
                    return allocationDa.createAndRelate(allocationData, id, "user");
                }
            })
    }
}

module.exports = UserDa;