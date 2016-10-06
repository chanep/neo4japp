import ServicesBase from './ServicesBase';

export default class SkillsServices extends ServicesBase {
	GetTopSkillSearchs(limit) {
		return super.callGetServices('resource-manager/top-skill-searches', {limit: limit});
	}
}