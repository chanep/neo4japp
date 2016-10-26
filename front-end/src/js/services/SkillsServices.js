import ServicesBase from './ServicesBase';

export default class SkillsServices extends ServicesBase {
	GetTopSkillSearchs(limit) {
		return super.callGetServices('resource-manager/top-skill-searches', {limit: limit});
	}

	GetSkilledUsersByOffice(skillId, limit) {
		return super.callGetServices('resource-manager/skilled-users-by-office/' + skillId, {limit: limit});
	}

	GetSkill(limit) {
		return super.callGetServices('skill', {limit: limit});
	}
}