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
        var _this = this;
        var response = {status: 'success', data: data};
        if(data && data.pager && data.data){
            response.pager = data.pager;
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

    _handleError(res, err){
        var errResp = {
            status: "error",
            error: err.toString()
        }
        res.status(500).send(errResp);
    }
}

module.exports = BaseController;