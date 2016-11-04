'use strict'
const errors = require('../shared/errors');
const P = require('bluebird');
const BaseTask = require('./base-task');
const messagingService = require('../services/messaging')

class SendPendingAppovalEmailsTask extends BaseTask{
    constructor(){
        super('send-pending-approval-emails');
    }
    _doRun(){
        return messagingService.sendPendingApprovalsEmail();
    }
}

module.exports = SendPendingAppovalEmailsTask;