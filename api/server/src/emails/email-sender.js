'use strict'
const swig = require('swig');
const config = require('../shared/config');

module.exports = {
    send: send
};

/**
 * Send an email
 * @param {any} mailData - from, to, replyTo, cc, cco fields
 * @param {any} templateName - Swig template name
 * @param {any} data - data to replace in swig templates
 */
function send(mailData, templateName, data){
    const subject = swig.renderFile(__dirname + '/templates/' + templateName + '.subject.swig', data);
    const html = swig.renderFile(__dirname + '/templates/' + templateName + '.body.swig', data);

    mailData.subject = subject;
    mailData.html = html;

    const provider = require('./providers/' + config.mail.provider);
    return provider.send(mailData);
}


        