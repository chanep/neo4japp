'use strict'
const P = require('bluebird');
const emailSender = require('../emails/email-sender');
const approverDa = new (require('../data-access/approver'));
const config = require('../shared/config');
const _ = require('lodash');
const async = require('async');
const asyncEachLimit = P.promisify(async.eachLimit);


const pendingApprovalsTemplate = "pending-approvals";
const approvalRequestTemplate = "approval-request";
const emailLink = config.webBaseUrl + '/#/managerhome';

module.exports = {
    sendPendingApprovalsEmail: sendPendingApprovalsEmail,
    sendApprovalRequestEmail: sendApprovalRequestEmail
};

function sendPendingApprovalsEmail(){
    let info = {
        sent: 0,
        errors: 0
    };

    return approverDa.findApproversWithPendingApprovals()
        .then(approvers => {
            return asyncEachLimit(approvers, 20, (approver, callback) => {
                const toAddress = buildAddress(approver);
                
                const data = {
                    first: approver.first,
                    employees: approver.pendingApprovalEmployees,
                    link: emailLink
                };

                const mailData = {
                    from: config.mail.fromAddress,
                    to: toAddress
                };

                emailSender.send(mailData, pendingApprovalsTemplate, data)
                    .then(() => {
                        info.sent++;
                        callback();
                    })
                    .catch(err => {
                        info.errors++;
                        console.log("error sending mail to " + toAddress, err);
                        callback();
                    });
            });
        })
        .then(() =>{
            return info;
        });
}

function sendApprovalRequestEmail(resourceManager, employeeId){
    return approverDa.findByIdFull(employeeId)
        .then(employee => {
            const approvers = employee.approvers;
            let promises = [];
            for(let approver of approvers){
                const data = {
                    approverFirst: approver.first,
                    rmFullname: resourceManager.fullname,
                    employeeFullname: employee.fullname,
                    link: emailLink
                };

                const mailData = {
                    from: config.mail.fromAddress,
                    to: buildAddress(approver),
                    cc: buildAddress(resourceManager),
                    replyTo: buildAddress(resourceManager)
                };

                promises.push(emailSender.send(mailData, approvalRequestTemplate, data))
            }

            return P.all(promises);
        });
}


function buildAddress(user){
    let original = {
        name: user.fullname,
        email: user.email
    };
    let overrides = [];
    for(let overrideAddress of config.mail.overrideAddresses){
        let override = _.clone(original);
        override.email = overrideAddress;
        overrides.push(override);
    }
    if(overrides.length === 0)
        overrides.push(original);
    
    let addressesStr = [];
    for(let address of overrides){
        addressesStr.push(`"${original.name}" <${address.email}>`);
    }
    return addressesStr.join(', ');
}