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
const skillSuggestionTemplate = "skill-suggestion";
const emailLink = config.webBaseUrl + '/#/managerhome';

module.exports = {
    sendPendingApprovalsEmail: sendPendingApprovalsEmail,
    sendApprovalRequestEmail: sendApprovalRequestEmail,
    sendSkillSuggestionEmail: sendSkillSuggestionEmail
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
                
                const bodyData = {
                    first: approver.first,
                    employees: approver.pendingApprovalEmployees,
                    link: emailLink
                };

                const mailData = {
                    from: config.mail.fromAddress,
                    to: toAddress
                };

                emailSender.send(mailData, pendingApprovalsTemplate, bodyData)
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
                const bodyData = {
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

                promises.push(emailSender.send(mailData, approvalRequestTemplate, bodyData))
            }

            return P.all(promises);
        });
}

function sendSkillSuggestionEmail(user, skillName, skillType, decription){
    const bodyData = {
        userName: user.fullname,
        skillName: skillName,
        skillType: skillType,
        decription: decription
    };

    const userAddress = `"${user.fullname}" <${user.email}>`;
    const mailData = {
        from: config.mail.fromAddress,
        to: config.mail.adminAddress,
        cc: userAddress,
        replyTo: userAddress
    };

    return emailSender.send(mailData, skillSuggestionTemplate, bodyData);
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