// Dependencies
import React from 'react';
import cookie from 'react-cookie';
import SessionServices from '../services/SessionServices';
import { hashHistory, Link, browserHistory, withRouter } from 'react-router';

// Base class: BasePage
class BasePage extends React.Component {
	constructor(props) {
		super(props);

		this._checkLoggedIn();
	}

	_checkLoggedIn() {
		this._isUserLoggedIn().then(trueOrFalse => {
			if (!trueOrFalse) {
				this.context.router.push({pathname: '/login'});
			}
		});
	}

	_isUserLoggedIn() {
		let session = new SessionServices();
		return session.CheckLoggedIn().then(status => {
			return status;
		});
	}

	_showSearch() {
		return (this.ResourceManagerLoggedIn());
	}

	GetUserLogged() {
		let data = cookie.load('currentUser');
		return data;
	}

	GetCurrentUserType() {
		let data = cookie.load('currentUser');

		if (data === undefined || data.roles === undefined || data === null || data.roles === null)
			return null;

		if (data.roles.includes('admin')) return 'admin';
		if (data.roles.includes('resourceManager')) return 'resourcemanager';
		if (data.roles.includes('approver')) return 'approver';
		
		return 'employee';
	}

	GetMyRootPath() {
		let currentUserType = this.GetCurrentUserType();
		if (currentUserType === null)
			return '/login';

		if (currentUserType === 'admin' || currentUserType === 'resourcemanager') return '/resourceshotspot';
		if (currentUserType === 'approver') return '/managerhome';
		if (currentUserType === 'employee') return '/myprofile';

        return '/';
	}

	ResourceManagerLoggedIn() {
		let currentUserType = this.GetCurrentUserType();
		return (currentUserType === 'admin' || currentUserType === 'resourcemanager');
	}
}

BasePage.contextTypes = {
  	router: React.PropTypes.object.isRequired
}

export default BasePage;