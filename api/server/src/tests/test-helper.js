var path = require('path');
var envFile = path.resolve(__dirname, "../.test-env");
require('dotenv').config({path: envFile});

const config = require('../shared/config');
const partition = config.db.partition;
const dbHelper = require('./db-helper');

module.exports = {
    resetTestDbBatch: function(dbName){
        return {
            'reset db' : {
                topic: function(){
                    var _this = this;
                    dbHelper.resetDb(partition)
                        .then(function(){
                            _this.callback(null)
                        })
                        .catch(function(err){
                            _this.callback(err, null)
                        });
                },
                'db reset' : function(err){
                    if(err){
                        console.log("error resetting db ", err)
                        throw err;
                    } else{
                        //console.log("db " + dbName + " has been reset")
                    }
                }
            }
        }
    }
};