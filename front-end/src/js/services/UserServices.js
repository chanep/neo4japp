import ServicesBase from './ServicesBase';

export default class UserServices extends ServicesBase {
	Login(username, password) {
		return super.callPostServices('session/', {'username':username,'password':password});
	}

	CheckLoggedIn() {
		return super.callGetServices('session/check', null);
	}

	GetUserData() {
		return super.callGetServices('user/details', null);
	}
}