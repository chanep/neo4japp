'use strict'
const config = require('../shared/config');
const errors = require('../shared/errors');

function isProduction(){
    process.env.NODE_ENV == 'prod'
}

class BaseController {
    constructor(){
        //make 'this' be the actual 'this' when instance functions are used as callbacks
        for(f in this){
            if(typeof this[f] === 'function')
                this[f] = this[f].bind(this);
        }
    }

    _buildSearch(req){
        var url_parts = url.parse(req.url, true);
        var queryString = url_parts.query;
        var search = qs.parse(queryString);
        // if(search.limit){
        //     search.limit = Number(search.limit);
        // }
        // if(search.offset){
        //     search.offset = Number(search.offset);
        // }
        return search;
    }


    //override to customize
    _createDto(data){
        return data;
    }


    _createDataResponse(data, createDto){
        let _this = this;
        let response = {status: 'success', data: data};
        if(data && data.paged && data.data){
            response.paged = data.paged;
            data = data.data;   
        }
        if(data){
            if(!createDto){
                response.data = data;
            } else if(Array.isArray(data)){
                response.data = data.map(function (item){
                    return _this._createDto(item);
                });
            } else {
                response.data = _this._createDto(data);
            }
        }
        return response;
    }

    _respondPromise(req, res, promise, transformResponse){
        promise.then((data) => {
            var response;
            if(typeof transformResponse === 'undefined'){
                response = this._createDataResponse(data, true);
            } else if (transformResponse === false){
                response = this._createDataResponse(data, false);
            } else {
                response = transformResponse(data);
            }
            res.send(response);
        }).catch(err => this._handleError(res, err));
    }

    _respondPromiseDelete(req, res, promise){
        this._respondPromise(req, res, promise, function(affected){
            return {
                status: "success",
                affected: affected
            }
        })
    }

    _respondPromiseUpdate(req, res, promise){
        this._respondPromise(req, res, promise, function(affected){
            return {
                status: "success",
                affected: affected[0]
            }
        })
    }

    _handleError(res, err) {
        let code;
        
        if (err instanceof errors.AuthorizationError) {
            code = 401;
        } else if (err instanceof errors.ForbiddenError) {
            code = 403;
        } else if (err instanceof errors.NotFoundError) {
            code = 404;
        } else if (err instanceof errors.BasGatewayError) {
            code = 502;
        }

        if (err instanceof errors.ValidationError) {
            console.log(err);
            let error = { code: err.code, message: err.message };
            if (err.data) {
                error.data = err.data;
            }
            res.status(422).send({
                status: "error",
                error: error
            });
        } else if (code) {
            console.log(err);
            res.status(code).send({
                status: "error",
                error: err.message
            });
        } else {
            let trackId = Math.floor((Math.random() * 100000000));
            let errorFull = errors.toString(err);
            console.log("trackId: " + trackId + " - ", err);

            var errResp = {
                status: "error",
                error: {
                    trackId: trackId,
                    message: "server error"
                }
            }

            if (!isProduction()) {
                errResp.error.devInfo = errorFull;
            }

            res.status(500).send(errResp);

        }
    }

}

module.exports = BaseController;