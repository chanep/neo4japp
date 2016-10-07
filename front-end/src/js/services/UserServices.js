import ServicesBase from './ServicesBase';

export default class UserServices extends ServicesBase {
	GetUserData(id) {
		if (id == null)
			return super.callGetServices('user/details', null);
		else
			return super.callGetServices('user/' + id + '/details', null);
	}

	GetEmployeeAllSkills() {
		return super.callGetServices('user/all-skills', null);
	}
}