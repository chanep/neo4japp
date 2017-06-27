'use strict'
const _ = require('lodash');
const async = require('async');
const errors = require('../../shared/errors');
const P = require('bluebird');
const clientDa = new (require('../../data-access/client'));
const userDa = new (require('../../data-access/user'));
const BaseTask = require('../base-task');
const path = require('path');

const request = require('request');

let asyncDoUntil = P.promisify(async.doUntil);
let asyncEach= P.promisify(async.each);
let asyncEachSeries= P.promisify(async.eachSeries);

const taskname ='user-clients-import';
const phonelistUrl = 'https://phonelist.ny.rga.com/gateway/json/employeeClients.aspx'

class UserClientsImportTask extends BaseTask{
    constructor(){
        super(taskname);
    }
    _getUsers(skip, limit){
        let query = {phonelistId: {$ne: null}, paged: {skip: skip, limit: limit}};
        return userDa.find(query);
    }
    _getClientIds(phonelistId){
        return new P((resolve, reject) => {
            let url = phonelistUrl + '?e=' + phonelistId;
            request.get(url, 
                    (err, result, body) => {
                        if(err){
                            reject(new errors.GenericError('error getting clients of user ' + phonelistId, err))
                        } else {
                            try{
                                let json = JSON.parse(body);
                                let user = json.Info[0];
                                if(user.Clients){
                                    let clientIds = user.Clients.map(c => c.clientID);
                                    resolve(clientIds);
                                } else{
                                    resolve([]);
                                }
                                
                            } catch(err){
                                reject(new errors.GenericError('error getting clients of user ' + phonelistId, err))
                            }
                        }
                    })
        });
    }
    _updateUserClients(user){
        let query = {phonelistId: {$in: user.clientIds}};

        return userDa.clearPhonelistClients(user.id)
            .then(() => clientDa.find(query))
            .then(clients => {
                return asyncEachSeries(clients, (client, callback) =>{
                    userDa.addClient(user.id, client.id)
                        .then(() => callback())
                        .catch(err => callback(err));
                })
            });
    }
    _updateUsersClients(users){
        return asyncEachSeries(users, (user, callback) => {
            this._updateUserClients(user)
                .then(() => this.info.updated++)
                .catch(err => {
                    this.info.errors++;
                    console.log(taskname + ` - error updating user ${user.username} clients`, err);
                })
                .then(() => callback());
        })
    }
    _getAndUpdateUsersClients(users){
        return this._getUsersClients(users)
            .then(usrs => {
                return this._updateUsersClients(usrs);
            })
    }
    _getUsersClients(users){
        return asyncEach(users, (user, callback) => {
            this._getClientIds(user.phonelistId)
                .then(clientIds => {
                    user.clientIds = clientIds;
                    callback();
                })
        })
        .then(() => users);
    }
    _processAllUsers() {
        const limit = 20;
        let skip = 0;
        let totalUsers = 0;
        return asyncDoUntil(callback => {
            this._getUsers(skip, limit)
                .then(data => {
                    totalUsers = data.paged.totalCount;
                    let users = data.data;
                    return this._getAndUpdateUsersClients(users);
                })
                .then(() => callback(null))
                .catch(err => callback(err));
        },() => {
            skip += limit;
            if((skip % 200) == 0)
                console.log(`... ${taskname} - info: ${JSON.stringify(this.info)}`);
            //return true;
            return (skip >= totalUsers);
        });
    }
    _doRun(){
        this.info = {updated: 0, errors: 0};

        return this._processAllUsers()
            .then(() => {
                return this.info;
            });
    }
}

module.exports = UserClientsImportTask;