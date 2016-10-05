import ServicesBase from './ServicesBase';

export default class SearchServices extends ServicesBase {
	GetSearchAll(query,limit) {
		return super.callGetServices('resource-manager/search-all', {term: query, limit: limit});
	}

	GetSearchBySkills(skillsIds,limit) {
		return super.callGetServices('resource-manager/users-by-skill', {skills:skillsIds, limit:limit});
	}
}