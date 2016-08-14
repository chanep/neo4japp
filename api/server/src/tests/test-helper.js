var path = require('path');
var envFile = path.resolve(__dirname, "../.test-env");
require('dotenv').config({path: envFile});

const config = require('../shared/config');
const partitionSuffix = config.db.partitionSuffix;
const testDbHelper = require('./test-db-helper');

module.exports = {
    resetTestDbBatch: function(){
        return {
            'reset db' : {
                topic: function(){
                    var _this = this;
                    testDbHelper.resetDb(partitionSuffix)
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