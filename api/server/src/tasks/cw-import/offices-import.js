'use strict'
const _ = require('lodash');
const async = require('async');
const errors = require('../../shared/errors');
const P = require('bluebird');
const CwBaseTask = require('./cw-base');
const OfficeDa = require('../../data-access/office');

class OfficesImportTask extends CwBaseTask{
    constructor(){
        super('offices-import');
    }
    _getOffices(){
        return this._req.get('office?ipp=200')
            .then(r => r.body.data);
    }
    _importOffices(offices) {
        let _this = this;
        let info = {
            updated: 0,
            created: 0,
            errors: 0
        };
        let officeDa = new OfficeDa();

        let eachSeries = P.promisify(async.eachSeries);
        return eachSeries(offices, function (o, callback) {
            let office = _this._transformOffice(o);
            if(office.timezone){ //don't import offices without timezone
                const mergeKeys = true;
                officeDa.upsert(office, ["sourceId"], mergeKeys)
                    .then(r => {
                        if (r.created) {
                            info.created++;
                        } else {
                            info.updated++;
                        }
                        //console.log("office upserted", r.data)
                        callback();
                    })
                    .catch(err => {
                        info.errors++;
                        let e = new errors.GenericError("Error importing office:" + office, err);
                        console.log(e);
                        callback();
                    });
            } else{
                callback();
            }
        })
        .then(() => {
            return info;
        })
        .catch(err => {
            console.log("error importing offices", err)
            throw err;
        });
    }
    _transformOffice(source){
        let office = _.pick(source, ["name", "description", "acronym", "country", "latitude", 
                                    "longitude", "address", "phone", "zip", "uri"]);
        office.sourceId = source._id;
        if(source.timezone && source.timezone.utc_offset)
            office.timezone = source.timezone.utc_offset;
        return office;
    }
    _doRun(){
        return this._login()
            .then(req => {
                this._req = req;
                return this._getOffices();
            })
            .then(offices => {
                return this._importOffices(offices);
            });
    }
}

module.exports = OfficesImportTask;