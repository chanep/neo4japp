module.exports = {
    admin: 'admin',
    resourceManager: 'resourceManager',
    approver: 'approver',
    searcher: 'searcher',
    allRoles : ['resourceManager', 'approver', 'searcher'],
    hasRole: function(rolesArray, role){
        return rolesArray.indexOf(role) > -1;
    },
    addRole: function(rolesArray, role){
        if(rolesArray.indexOf(role) < 0){
            rolesArray.push(role);
        }
    },
    removeRole: function(rolesArray, role){
        if(rolesArray.indexOf(role) > -1){
            rolesArray.splice(rolesArray.indexOf(role), 1);
        }
    }
};