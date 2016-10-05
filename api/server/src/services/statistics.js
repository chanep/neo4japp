'use strict'
const _ = require('lodash');
const postal = require('postal');
const userDa = new (require('../data-access/user'));


const skillChannel = postal.channel('skill');
const subscriptions = [];

module.exports = {
	start: start,
	stop: stop
};


function start() {
	var sub = skillChannel.subscribe("searched", onSkillSearched);
	subscriptions.push(sub);
	console.log("Statistics started...");
}

function stop() {
	_.each(subscriptions, function(sub){
		sub.unsubscribe();
	});
	subscriptions = [];
}

function onSkillSearched(data){
    let userId = data.userId;
    let skillIds = data.skillIds;
    let date = new Date();
    for(let skillId of skillIds){
        userDa.addSkillSearch(userId, skillId, date)
            .catch(err => {
                console.log(err);
            })
    }
}
