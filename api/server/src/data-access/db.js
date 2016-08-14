'use strict'
const config = require('../shared/config').db;
const P = require('bluebird');

const neo4j = require('neo4j-driver').v1;
const driver = neo4j.driver(config.server, neo4j.auth.basic(config.user, config.pass));

driver.beginTransaction = function(){
    let session = driver.session();
    let tx = session.beginTransaction();
    return new TxWrapper(tx, session);
}

module.exports = driver;

class TxWrapper{
    constructor(tx, session){
        this._tx = tx;
        this._session = session;
    }
    closeSession(){
        this._session.close();
        console.log('session closed');
    }
    run(cmd, params){
        return new P((resolve, reject) => {
            this._tx.run(cmd, params)
                .subscribe({
                    onNext: function (result) {
                        this._result = result;
                    },
                    onCompleted: function result(result) {
                        resolve(this._result);
                    },
                    onError: function (error) {
                        reject(error);
                    }
                });
        });
    }
    commit(){
        return new P((resolve, reject) => {
            let _this = this;
            this._tx.commit()
                .subscribe({
                    onCompleted: function result(result) {
                        _this._session.close();
                        resolve(result);
                    },
                    onError: function (error) {
                        reject(error);
                    }
                });
        })
    }
    rollback(){
       return new P((resolve, reject) => {
           let _this = this;
            this._tx.rollback()
                .subscribe({
                    onCompleted: function result(result) {
                        _this._session.close();
                        resolve(result);
                    },
                    onError: function (error) {
                        reject(error);
                    }
                });
        })
    }
}


