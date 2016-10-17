import ServicesBase from './ServicesBase';

export default class UserServices extends ServicesBase {
	GetUserData(id) {
		if (id == null)
			return super.callGetServices('user/details', null);
		else
			return super.callGetServices('user/' + id + '/details', null);
	}

	GetEmployeeSkills(userId, all) {
		return super.callGetServices('user/' + userId + '/skills', {all: all});
	}

	GetSimilarSkilledUsers(id) {
		return super.callGetServices('user/' + id + '/similar-skilled-users');
	}
}