import ServicesBase from './ServicesBase';

export default class SearchServices extends ServicesBase {
	GetSearchAll(query,limit) {
		return super.callGetServices('resource-manager/search-all', {term: query, limit: limit});
	}

	GetSearchBySkills(skillsIds,limit, officesIds = []) {
		if (officesIds.length == 0)
			return super.callGetServices('resource-manager/users-by-skill', {skills:skillsIds, limit:limit});
		else
			return super.callGetServices('resource-manager/users-by-skill', {skills:skillsIds, limit:limit, offices: officesIds});
	}
}