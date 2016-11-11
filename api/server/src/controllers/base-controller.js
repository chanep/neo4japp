'use strict'
const config = require('../shared/config');
const errors = require('../shared/errors');


class BaseController {
    constructor(){
    //    for (let name of getAllPropertyNames(this, 1)) {
    //         let method = this[name];
    //         // Supposedly you'd like to skip constructor
    //         if (!(method instanceof Function) || name === 'constructor') continue;
    //         this[name] = method.bind(this);
    //     }
    }

    _buildSearch(req){
        let search =  req.parsedQuery;
        for(let k in search){
            search[k] = parseValue(search[k]);
        }
        return search;

        function parseValue(value){
            if(Array.isArray(value))
                return value.map(v => parseValue(v));
            if(!isNaN(Number(value)))
                return Number(value)
            if (value == 'true')
                return true;
            if (value == 'false')
                return false;
            return value;
        }
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
        try {
            let code;

            if (err instanceof errors.AuthorizationError) {
                code = 401;
            } else if (err instanceof errors.ForbiddenError) {
                code = 403;
            } else if (err instanceof errors.NotFoundError) {
                code = 404;
            } else if (err instanceof errors.BadGatewayError) {
                code = 502;
            } else if (err instanceof errors.BadRequestError) {
                code = 400;
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
                console.log("trackId: " + trackId + " - ", err);

                var errResp = {
                    status: "error",
                    error: {
                        trackId: trackId,
                        message: "server error"
                    }
                }

                if (!config.isProduction) {
                    errResp.error.devInfo = err.toString();
                }
                res.status(500).send(errResp);

            }
        } catch (err) {
            console.log(err);
            res.status(500).send({ status: 'error', error: 'server error' });
        }

    }

}

module.exports = BaseController;

// function getAllPropertyNames( obj) {
//     let i = 0;
//     var props = [];
//     do {
//         i++;
//         Object.getOwnPropertyNames( obj ).forEach(function ( prop ) {
//             if ( props.indexOf( prop ) === -1 ) {
//                 props.push( prop );
//             }
//         });
//     } while ( obj = Object.getPrototypeOf( obj ) );
//     return props;
// }