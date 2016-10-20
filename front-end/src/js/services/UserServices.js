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

	SetKnowledge(skillId, level, want) {
		return super.callPutServices('user/knowledge', {'skillId': skillId, 'level': level, 'want': want});
	}

	DeleteKnowledge(skillId) {
		return super.callDeleteServices('user/knowledge', {'skillId': skillId});
	}

	GetMyTeam() {
		return super.callGetServices('approver/my-team', {'onlyPendingApprove': false, 'includeWantSkills': true});
	}
}