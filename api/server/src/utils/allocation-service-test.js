'use strict'
require('dotenv').load();
const errors = require('../shared/errors');
const P = require('bluebird');
const rp = require('request-promise');
const config = require('../shared/config').pl;
const xml2js = require('xml2js');
const moment = require('moment');
const querystring = require('querystring');


let data = querystring.stringify({
    employeeId: JSON.stringify([[45553]]),  //ecanepa
    startDate: "11-14-2016",
    endDate: "11-20-2016"
});

callPostWebServices('gateway/json/empAllocations.asmx/getEmployeeAllocations', data)
    .then(allocationData => {
        console.log("allocationData:", allocationData);
    });


function callPostWebServices(endpoint, data) {
    var finalUri = `${config.apiBase}${endpoint}`;
    var options = {
        url: finalUri,
        method: 'POST',
        body: data,
        json: false,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': data.length
        }
    }

    return rp(options).then(data => {
        var parser = new xml2js.Parser();
        var resultObj;
        parser.parseString(data, function (err, result) {
            resultObj = result['string']._;
        });

        return JSON.parse(resultObj);
    });
    
}