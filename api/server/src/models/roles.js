module.exports = {
    admin: 'admin',
    resourceManager: 'resourceManager',
    approver: 'approver',
    allRoles : ['admin', 'resourceManager', 'approver'],
    hasRole: function(rolesArray, role){
        return rolesArray.indexOf(role) > -1;
    },
    addRole: function(rolesArray, role){
        if(rolesArray.indexOf(role) < 0){
            rolesArray.push(role);
        }
    }
};