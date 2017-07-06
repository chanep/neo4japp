import ServicesBase from './ServicesBase';
import { hashHistory } from 'react-router';

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

		if (locationQueryData.sortBy !== undefined && locationQueryData.sortBy !== "undefined" && locationQueryData.sortBy !== "" && locationQueryData.sortBy !== null) {
				sortBy = locationQueryData.sortBy;
		}

		return {
			skillsIds, interestsIds, clientsIds, locationsIds, levelsIds, sortBy
		}
	}

	UpdateSearchState(newSearchState) {
		var path = '';

		if (newSearchState.skillsIds.length > 0) {
				path += (path !== ""? '&' : '') + 'skills=' + newSearchState.skillsIds.join();
		}

		if (newSearchState.interestsIds.length > 0) {
				path += (path !== ""? '&' : '') + 'interests=' + newSearchState.interestsIds.join();
		}

		if (newSearchState.clientsIds.length > 0) {
				path += (path !== ""? '&' : '') + 'clients=' + newSearchState.clientsIds.join();
		}

		if (newSearchState.levelsIds.length > 0) {
				path += (path !== ""? '&' : '') + 'levels=' + newSearchState.levelsIds.join();
		}

		if (newSearchState.locationsIds.length > 0) {
				path += (path !== ""? '&' : '') + 'locations=' + newSearchState.locationsIds.join();
		}

		if (newSearchState.sortBy != 'relevance') {
			path += (path !== ""? '&' : '') + 'sortBy=' + newSearchState.sortBy;
		}

		path = "/searchresults?" + path;

		hashHistory.push({ pathname: path });
	}
}
