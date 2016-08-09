'use strict'
const _ = require('lodash');
const async = require('async');
const errors = require('../shared/errors');
const P = require('bluebird');
const CwBaseTask = require('./cw-base');
const PositionDa = require('../data-access/position');

class PositionsImportTask extends CwBaseTask{
    constructor(){
        super('positions-import');
    }
    _getPositions(page, ipp){
        return this._req.get(`position?p=${page}&ipp=${ipp}`)
            .then(r => r.body.data);
    }
    _importPositions(positions) {
        let _this = this;
        let info = {
            updated: 0,
            created: 0,
            errors: 0,
            total: function(){ return this.updated + this.created + this.errors; }
        };
        let positionDa = new PositionDa();

        async.eachSeries = P.promisify(async.eachSeries);
        return async.eachSeries(positions, function (d, callback) {
            let position = _this._transformPosition(d);
            positionDa.upsert(position, false, ["sourceId"])
                .then(r => {
                    if (r.created) {
                        info.created++;
                    } else {
                        info.updated++;
                    }
                    callback();
                })
                .catch(err => {
                    info.errors++;
                    let e = new errors.GenericError("Error importing position:" + position, err);
                    console.log(e);
                    callback();
                })
        })
        .then(() => {
            return info;
        });
    }
    _transformPosition(source){
        let position = _.pick(source, ["name"]);
        position.sourceId = source._id;
        return position;
    }
    // _transformPositions(sources){
    //     return sources.map(s => this._transformPosition(s));
    // }
    _doRun(){
        let ipp = 50;
        let info = {
            updated: 0,
            created: 0,
            errors: 0
        };
        return this._login()
            .then(req => {
                this._req = req;
                let page = 1;

                async.doUntil = P.promisify(async.doUntil);
                return async.doUntil(callback => {
                    this._getPositions(page, ipp)
                        .then(ps => this._importPositions(ps))
                        .then(partialInfo => callback(null, partialInfo))
                        .catch(err => callback(err));
                }, partialInfo => {
                    page++;
                    info.created += partialInfo.created;
                    info.updated += partialInfo.updated;
                    info.errors += partialInfo.errors;
                    console.log("page", page)
                    console.log("partialinfo", partialInfo)
                    console.log("total", partialInfo.total())
                    return (partialInfo.total() == 0);
                })
                .then(() => {
                    return info;
                });
            });
    }
}

module.exports = PositionsImportTask;