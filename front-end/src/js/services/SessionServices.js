import ServicesBase from './ServicesBase';

export default class SessionServices extends ServicesBase {
	Login(username, password) {
		return super.callPostServices('session/', {'username':username,'password':password});
	}

	CheckLoggedIn() {
		return super.callGetServices('session/check');
	}
}