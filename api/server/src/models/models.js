const u = require('./user');
const s = require('./skill');

module.exports = {
    user: u.user,
    office: u.office,
    position: u.position,
    department: u.department,
    client: u.client,
    skill: s.skill,
    allocation: u.allocation,
    skillGroup: s.skillGroup,
    taskStatus: require('./task-status'),
    appSetting: require('./app-setting')
};