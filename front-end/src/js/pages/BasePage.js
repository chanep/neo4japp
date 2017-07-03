// Dependencies
import React from 'react';
import cookie from 'react-cookie';
import SessionServices from '../services/SessionServices';
import { hashHistory, Link, browserHistory, withRouter } from 'react-router';

// Base class: BasePage
class BasePage extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		this._checkLoggedIn();
	}

	shouldComponentUpdate(nextProps, nextState) {
		var result = this._checkLoggedIn().then(() => {
			return resolve(true);
		}).catch(() => {
			return resolve(false);
		});

		return result;
	}

	_checkLoggedIn() {
		return this._isUserLoggedIn().then(trueOrFalse => {
			if (!trueOrFalse) {
				this.context.router.push({pathname: '/login'});
				resolve();
			}
		}).catch(err => {
			console.log("err", err);
			this.context.router.push({pathname: '/error'});
			reject();
		});
	}

	_isUserLoggedIn() {
		let session = new SessionServices();
		return session.CheckLoggedIn().then(status => {
			return status;
		});
	}

	_showSearch() {
		return (this.ResourceManagerLoggedIn() || this.SearcherLoggedIn());
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
		if (data.roles.includes('searcher')) return 'searcher';

		return 'employee';
	}

	EmployeeHasRole(roleName) {
		let data = cookie.load('currentUser');

		return data ? data.roles.includes(roleName) : false;
	}

	EmployeeHasAnyRole(roleNameList) {
		return roleNameList.some(roleName => this.EmployeeHasRole(roleName));
	}

	GetMyRootPath() {
		let currentUserType = this.GetCurrentUserType();
		if (currentUserType === null)
			return '/login';

		if (currentUserType === 'resourcemanager') return '/resourceshotspot';
		if (currentUserType === 'approver') return '/managerhome';
		if (currentUserType === 'employee' || currentUserType === 'searcher' || currentUserType === 'admin') return '/myprofile';

        return '/';
	}

	ResourceManagerLoggedIn() {
		let currentUserType = this.GetCurrentUserType();
		return (currentUserType === 'admin' || currentUserType === 'resourcemanager');
	}

	SearcherLoggedIn() {
		return this.EmployeeHasRole('searcher');
	}
}

BasePage.contextTypes = {
  	router: React.PropTypes.object.isRequired
}

export default BasePage;
