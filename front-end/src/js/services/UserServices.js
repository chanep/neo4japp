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

	GetOffice() {
		return super.callGetServices('office', null);
	}

	ApproveKnowledge(knowledgeId) {
		return super.callPutServices('approver/approve', {'knowledgeId': knowledgeId});
	}

	AddInterest(interestName) {
		return super.callPutServices('user/interest', {'interestName': interestName});
	}

	RemoveInterest(interestId) {
		return super.callDeleteServices('user/interest', {'interestId': interestId});
	}

	GetIndustries() {
		return super.callGetServices('skill/by-group-type/industry');
	}

	GetInterests(name, ids, limit) {
		return super.callGetServices('interest', { "name": name, "ids": ids, "limit": limit });
	}

	RequestManagerApproval(employeeId) {
		return super.callPutServices("resource-manager/approval-request/" + employeeId, null);
	}

	AddClient(clientName) {
		return super.callPutServices('user/client', {'clientName': clientName});
	}

	GetClients(name, ids, limit) {
		return super.callGetServices('client', { "name": name, "ids": ids, "limit": limit });
	}

	RemoveClient(clientId) {
		return super.callDeleteServices('user/client', {'clientId': clientId});
	}
}