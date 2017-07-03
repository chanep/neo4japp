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

	GetSearchStateFromLocationQuery(locationQueryData) {
		let skillsIds = [];
		let interestsIds = [];
		let clientsIds = [];
		let locationsIds = [];
		let levelsIds = [];
		let sortBy = "relevance";

		if (locationQueryData.skills !== undefined) {
				skillsIds = locationQueryData.skills.split(',');
		}

		if (locationQueryData.interests !== undefined) {
				interestsIds = locationQueryData.interests.split(',');
		}

		if (locationQueryData.clients !== undefined) {
				clientsIds = locationQueryData.clients.split(',');
		}

		if (locationQueryData.locations !== undefined) {
				locationsIds = locationQueryData.locations.split(',');
		}

		if (locationQueryData.levels !== undefined) {
				levelsIds = locationQueryData.levels.split(',');
		}

		if (locationQueryData.orderBy !== undefined && locationQueryData.orderBy !== "undefined" && locationQueryData.orderBy !== "" && locationQueryData.orderBy !== null) {
				sortBy = locationQueryData.orderBy;
		}

		return {
			skillsIds, interestsIds, clientsIds, locationsIds, levelsIds, sortBy
		}
	}
}
