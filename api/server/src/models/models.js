const e = require('./employee');
const s = require('./skill');

module.exports = {
    employee: e.employee,
    office: e.office,
    position: e.position,
    department: e.department,
    skill: s.skill,
    skillGroup: s.skillGroup,
    taskStatus: require('./task-status'),
    appSetting: require('./app-setting')
};