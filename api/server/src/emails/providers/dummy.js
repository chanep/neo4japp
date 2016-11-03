'use strict'
const P = require('bluebird');
const config = require('../../shared/config');
const errors = require('../../shared/errors');
const fs = require('fs');

function send(mailData){
    return new P((resolve, reject) => {
        fs.writeFile(__dirname + '/../emails/sent/' + mailData.to + '-' + Date.now(), JSON.stringify(mailData), function(error, info){
            if(error){
                const e = new errors.GenericError("Error sending email", error);
                reject(e);
            } else{
                console.log('Message sent to: ' + mailData.to);
                resolve();
            }
        });
    });
}