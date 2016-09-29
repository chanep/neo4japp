'use strict'
const P = require('bluebird');
const config = require('../shared/config');
const errors = require('../shared/errors');
const BaseController = require('./base-controller');
const officeDa = new (require('../data-access/office'));

class OfficeController extends BaseController{

    /**
    @api {get} /api/office Find Offices
    @apiGroup Offices
    
    @apiUse findResponse
    */
    find(req, res, next){
        let promise = officeDa.find();
        this._respondPromise(req, res, promise);
    }

} 

module.exports = OfficeController;

    /**
    @apiDefine findResponse
        @apiSuccessExample {json} Success-Response:
          HTTP/1.1 200 OK
          {
            status: "success",
            data: [{
                id: 260,
                name: "Buenos Aires", 
                description: "Buenos Aires", 
                sourceId: "5679ad1fd7c7c2aaf75ab508", 
                zip: "C1414DAP", 
                country: "Argentina", 
                address: "Uriarte 1572", 
                acronym: "BA", 
                phone: "+54 11 5984 0500", 
                longitude: -58.43251
                latitude: -34.587572, 
                uri: "buenos-aires"
            }, {...}]
          }
    */
