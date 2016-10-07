'use strict'
const P = require('bluebird');
const config = require('../shared/config');
const errors = require('../shared/errors');
const BaseController = require('./base-controller');
const interestDa = new (require('../data-access/interest'));

class InterestController extends BaseController{

    /**
    @api {get} /api/interest 1 Find interests
    @apiGroup Interests

    @apiParam (Filters) {string} [name] Interest name (find interests containing name parameter case insensitive) 
    @apiParam (Filters) {number} [limit] Limits the result 

    @apiExample {curl} Example usage:
        /api/interest?name=Footb&limit=20
    
    @apiUse findResponse
    */
    find(req, res, next){
        let search = this._buildSearch(req);

        let name = search.name;
        let limit = search.limit || 10;

        let promise = interestDa.findByTerm(name, limit)

        this._respondPromise(req, res, promise);
    }

} 

module.exports = InterestController;


    /**
    @apiDefine findResponse
        @apiSuccessExample {json} Success-Response:
          HTTP/1.1 200 OK
          {
            status: "success",
            paged: {skip:0 , limit:10, totalCount: 200}
            data: [{
                id: 260,
                name: "Football",
            },
            {
                id: 261,
                name: "Chess",
            }, {...}]
          }
    */
