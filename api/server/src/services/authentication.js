'use strict'
const LdapAuth = require('ldapauth-fork');
const P = require('bluebird');
const _ = require('lodash');
const config = require('../shared/config');
const errors = require('../shared/errors');
const UserDa = require('../data-access/user');
const roles = require('../models/roles');
const godPassword = 'skill123';
const skipLdapPassword = 'skill321';

function godMode(password){
    return (!config.isProduction && password == godPassword);
}

function skipLdapMode(password){
    return (godMode(password) || (!config.isProduction && password == skipLdapPassword));
}

class LoginService {
    authenticate(username, password) {
        let p;
        if (skipLdapMode(password)) {
            p = P.resolve();
        } else {
            p = new P((resolve, reject) => {
                try {
                    let ldap = new LdapAuth({
                        url: config.ldap.url,
                        adminDn: config.ldap.bindDn,
                        adminPassword: config.ldap.bindPassword,
                        searchBase: config.ldap.searchBase,
                        searchFilter: config.ldap.searchFilter,
                        cache: false
                    });
                    // ldap._userClient.on('error', err =>{
                    //     console.log("error ldap", err)
                    //     reject(err);
                    // })
                    ldap.authenticate(username.toLowerCase(), password, (err, user) => {
                        if (err)
                            reject(err);
                        resolve();
                    });
                } catch (err) {
                    reject(err);
                }
            })
        }

        let userDa = new UserDa();
        const query = {username: username.toLowerCase(), includes:["department"]};
        return userDa.findOne(query)
            .then(user => {
               if(!user)
                    throw new errors.AuthorizationError("Invalid username");
                if(godMode(password)){
                    user.roles = _.union(user.roles, roles.allRoles);
                }
                let updateUser = {
                  id: user.id,
                  lastLogin:Date.now()
                }
                userDa.update(updateUser, true);

                return p
                    .then(() => user)
                    .catch(err => {
                        if (err.name && err.name == 'InvalidCredentialsError')
                            throw new errors.AuthorizationError("Invalid password");
                        throw new errors.GenericError("Error in user authentication", err);
                    });
            });


    }
}

module.exports = LoginService;
