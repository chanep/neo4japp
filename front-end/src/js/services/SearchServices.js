import ServicesBase from './ServicesBase';

export default class SearchServices extends ServicesBase {
	GetSearchAll(query,limit) {
		return super.callGetServices('resource-manager/search-all', {term: query, limit: limit});
	}

	GetSearchBySkills(skillsIds, interestsIds, limit, officesIds = []) {
		if (interestsIds.length == 0)
			interestsIds = [];

		if (officesIds.length == 0)
			return super.callGetServices('resource-manager/users-by-skill', {skills:skillsIds, limit:limit, interests:interestsIds});
		else
			return super.callGetServices('resource-manager/users-by-skill', {skills:skillsIds, limit:limit, interests:interestsIds, offices: officesIds});
	}
}