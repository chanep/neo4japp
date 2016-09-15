import ServicesBase from './ServicesBase';

export default class UserServices extends ServicesBase {
	GetUserData() {
		return super.callGetServices('user/details', null);
	}
}