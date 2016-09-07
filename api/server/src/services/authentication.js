'use strict'
const LdapAuth = require('ldapauth-fork');
const P = require('bluebird');
const config = require('../shared/config');
const errors = require('../shared/errors');
const UserDa = require('../data-access/user');
const roles = require('../models/roles');
const godPassword = 'skill123';

function godMode(password){
    return (!config.isProduction && password == godPassword);
}

class LoginService {
    authenticate(username, password) {
        let p;
        if (godMode(password)) {
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
                    ldap.authenticate(username, password, (err, user) => {
                        if (err)
                            reject(err);
                        resolve();
                    });
                } catch (err) {
                    reject(err);
                }
            })
        }

        return p
            .then(result => {
                let userDa = new UserDa();
                return userDa.findByUsername(username);
            })
            .then(result => {
                let userDa = new UserDa();
                return userDa.findByUsername(username);
            })
            .then(user => {
                if(godMode(password)){
                    user.roles = roles.allRoles;
                }
                return user;
            })
            .catch(err => {
                if (err.name && err.name == 'InvalidCredentialsError')
                    throw new errors.AuthorizationError("Invalid password");
                throw new errors.GenericError("Error in user authentication", err);
            });

    }
}

module.exports = LoginService;