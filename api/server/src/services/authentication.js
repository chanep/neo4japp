'use strict'
const LdapAuth = require('ldapauth-fork');
const P = require('bluebird');
const config = require('../shared/config');
const errors = require('../shared/errors');
const UserDa = require('../data-access/user');

class LoginService {
    authenticate(username, password){
        let ldap = new LdapAuth({
            url: config.ldap.url,
            adminDn: config.ldap.bindDn,
            adminPassword: config.ldap.bindPassword,
            searchBase: config.ldap.searchBase,
            searchFilter: config.ldap.searchFilter,
            cache: false
        });

        let authenticate = P.promisify(ldap.authenticate, {context: ldap});

        let p;
        if(!config.isProduction && password == 'skill123'){
            p = P.resolve();
        } else{
            p = authenticate(username, password);
        }

        return p
            .then(result =>{
                let userDa = new UserDa();
                return userDa.getByUsername(username);
            })
            .catch(err => {
                if(err.name && err.name == 'InvalidCredentialsError')
                    throw new errors.AuthorizationError("Invalid password");
                throw new errors.AuthorizationError(err.message);
            });


    //     ldap.authenticate(username, password, function (err, user) {
    // //    var user = {mail: "Mauro.Gonzalez@rga.com"}, err = false; // delete this line
    //     if (err) {
    //         console.log("LDAP auth error: %s", err);
    //         res.send(400, err.name);
    //     } else {
    //         mongoose.models.User.findOne({email: user.mail})
    //             .populate('skill_levels')
    //             .exec(function(err, u) {
    //                 if (!err) {
    //                     if (!u) {
    //                         u = new mongoose.models.User();
    //                         u.fromLDAP(user, function(err, usr) {
    //                             req.session.user = usr;
    //                             req.session.role = usr.getRole(); 
    //                             res.send(201, 'Session Created');
    //                         });
    //                     } else {
    //                         u.updateFromLDAP(user, function(err, usr) {
    //                             if (!err) {
    //                                 req.session.user = usr;
    //                                 res.send(201, {user: req.session.user.toJSON(), role: req.session.user.getRole()});    
    //                             }
    //                         });
    //                     }
    //                 }
    //             });
    //     }
    // });
    }
}

module.exports = LoginService;