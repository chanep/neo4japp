import ServicesBase from './ServicesBase';

export default class SkillsServices extends ServicesBase {
	GetTopSkillSearchs(limit, fromDate, toDate) {
		return super.callGetServices('resource-manager/top-skill-searches', { "limit": limit, "fromDate": fromDate, "toDate": toDate });
	}

	GetSkilledUsersByOffice(skillId, limit) {
		return super.callGetServices('resource-manager/skilled-users-by-office/' + skillId, {limit: limit});
	}

	GetAllSkills() {
		return super.callGetServices('skill/all-groups', null);
	}

	GetSkill(limit) {
		return super.callGetServices('skill', {limit: limit});
	}

	GetSkillsByIds(ids, limit) {
		return super.callGetServices('skill', {ids: ids, limit: limit});
	}

	SuggestSkill(skillName, skillDescription) {
		return super.callPutServices('user/skill-suggestion', { skillName: skillName, skillType: 'skill', description: skillDescription });
	}

	GetUsersBySkillStatus(limit, noSkills) {
		return super.callGetServices('resource-manager/skill-by-user', {limit, noSkills});
	}
}
