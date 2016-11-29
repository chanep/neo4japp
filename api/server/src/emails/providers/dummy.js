'use strict'
const P = require('bluebird');
const config = require('../../shared/config');
const errors = require('../../shared/errors');
const fs = require('fs');

module.exports = {
    send: send
};

function send(mailData){
    return new P((resolve, reject) => {
        let mailTo = mailData.to.match(/<(.*?)>/);
        if(mailTo && mailTo.length >= 2)
            mailTo = mailTo[1];
        else
            mailTo = mailData.to;

        fs.writeFile(__dirname + '/../sent/' + mailTo + '-' + Date.now(), JSON.stringify(mailData), function(error, info){
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