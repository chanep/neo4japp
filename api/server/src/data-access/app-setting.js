'use strict'
const _ = require('lodash');
const BaseDa = require('./base-da');
const model = require('../models/models').appSetting;
const errors = require('../shared/errors');

class AppSettingDa extends BaseDa{
    constructor(tx){
        super(model, tx);
    }
    get(name){
        return this.findOne({name: name})
            .then(data => {
                if(!data)
                    return null;
                return data.value;
            })
    }
    set(name, value){
        let v = value.toString();
        return this.upsert({name: name, value: v}, ["name"]);
    }
}

module.exports = AppSettingDa;