'use strict'
const _ = require('lodash');
const async = require('async');
const errors = require('../../shared/errors');
const P = require('bluebird');
const clientDa = new (require('../../data-access/client'));
const BaseTask = require('../base-task');
const path = require('path');

const request = require('request');

let asyncEachLimit = P.promisify(async.eachLimit);

const taskname ='clients-import';
const phonelistUrl = 'http://phonelist/gateway/json/clients.aspx'

class ClientsImportTask extends BaseTask{
    constructor(){
        super(taskname);
    }
    _getClients() {
        return new P((resolve, reject) => {
            request.get(phonelistUrl,
                (err, result, body) => {
                    if (err) {
                        reject(new errors.GenericError('error getting clients from phonelist', err))
                    } else {
                        try {
                            let json = JSON.parse(body);
                            let clients = json.clients;
                            resolve(clients);
                        } catch (err) {
                            reject(new errors.GenericError('error getting clients from phonelist', err))
                        }
                    }
                })
        });
    }
    _upsertClients(clients){
        return asyncEachLimit(clients, 20, (c, callback) =>{
            let client = this._transformClient(c);
            clientDa.upsert(client)
                .then(data => {
                    if(data.updated)
                        this.info.updated++;
                    else
                        this.info.created++;
                    callback();
                })
                .catch(err => {
                    this.info.errors++;
                    console.log(taskname + ` - error upserting client ${client.name}`, err);
                    callback();
                })
        });
    }
    _transformClient(c){
        let client = {
            phonelistId: c.ID,
            name: c.name
        }

        return client;
    }
    _doRun(){
        this.info = {updated: 0, created: 0, errors: 0};

        return this._getClients()
            .then(clients => {
                return this._upsertClients(clients);
            })
            .then(() => {
                return this.info;
            });
    }
}

module.exports = ClientsImportTask;