'use strict'
const BaseDa = require('./base-da');

class TaskStatusDa extends BaseDa{
    constructor(tx){
        super(tx, 'TaskStatus');
    }
    setRunning(taskName, info){
        let data = {
            name: taskName,
            status: "running",
            lastStart: new Date(),
            info: info
        };

        let query = {name: taskname};
        return this.findAll(query)
            .then(tasks => {
                if(tasks.length == 0){
                    return this.create(data);
                } else{
                    data.id = tasks[0].id;
                    return this.update(data);
                }
            })
    }
}

module.exports = TaskStatusDa;

