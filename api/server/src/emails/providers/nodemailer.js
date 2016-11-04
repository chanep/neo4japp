'use strict'
const nodemailer = require('nodemailer');
const P = require('bluebird');
const config = require('../../shared/config');
const errors = require('../../shared/errors');

module.exports = {
    send: send
};

function send(mailData){
    const smtpConfig = {
        host: config.smtpHost
    };
    const transporter = nodemailer.createTransport(smtpConfig);
    return new P((resolve, reject) => {
        transporter.sendMail(mailData, function(error, info){
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