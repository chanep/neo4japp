import ServicesBase from './ServicesBase';

export default class SearchServices extends ServicesBase {
	GetSearchAll(query,limit) {
		return super.callGetServices('resource-manager/search-all', 'term='+ query + '&limit=' + limit);
	}

	GetSearchBySkills(query,limit) {
		return super.callGetServices('resource-manager/user-by-skill', {skills:skills});
	}
}