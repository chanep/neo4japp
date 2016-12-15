'use strict'
const P = require('bluebird');
const config = require('../shared/config');
const errors = require('../shared/errors');
const BaseController = require('./base-controller');
const clientDa = new (require('../data-access/client'));

class ClientController extends BaseController{

    /**
    @api {get} /api/client Find Clients
    @apiGroup Clients

    @apiParam (Filters) {string} [name] Client name (find clients containing name parameter case insensitive) 
    @apiParam (Filters) {Array} [ids] Client id's
    @apiParam (Filters) {number} [limit] Limits the result 

    @apiExample {curl} Example usage:
        /api/client?name=pata&limit=20
    
    @apiUse findClientResponse
    */
    find(req, res, next){
        let search = this._buildSearch(req);

        let name = search.name;
        let ids = search.ids;
        let limit = search.limit || 10;

        let promise;
        if(ids)
            promise = clientDa.find({id: {$in: ids}});
        else
            promise = clientDa.findByTerm(name, limit);

        this._respondPromise(req, res, promise);
    }

} 

module.exports = ClientController;


    /**
    @apiDefine findClientResponse
        @apiSuccessExample {json} Success-Response:
          HTTP/1.1 200 OK
          {
            status: "success",
            paged: {skip:0 , limit:10, totalCount: 200}
            data: [{
                id: 260,
                name: "Patagonia",
            },
            {
                id: 261,
                name: "CompumundoHiperMegaRed",
            }, {...}]
          }
    */
