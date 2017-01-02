import ServicesBase from './ServicesBase';

export default class SearchServices extends ServicesBase {
	GetSearchAll(query,limit) {
		return super.callGetServices('resource-manager/search-all', {term: query, limit: limit});
	}

	GetSearchBySkills(skillsIds, interestsIds, clientsIds, limit, officesIds = [], levelsIds = [], sortBy) {
		if (interestsIds.length == 0)
			interestsIds = [];

		if (clientsIds.length == 0)
			clientsIds = [];

		if (officesIds.length == 0)
			return super.callGetServices('resource-manager/users-by-skill', {skills:skillsIds, limit:limit, levels: levelsIds, interests:interestsIds, clients:clientsIds, orderBy:sortBy});
		else
			return super.callGetServices('resource-manager/users-by-skill', {skills:skillsIds, limit:limit, levels: levelsIds, interests:interestsIds, offices: officesIds, clients:clientsIds, orderBy:sortBy});
	}
}