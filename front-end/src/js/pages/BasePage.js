// Dependencies
import React from 'react';
import cookie from 'react-cookie';
import SearchServices from '../services/SearchServices';
import SessionServices from '../services/SessionServices';
import { hashHistory, Link, browserHistory, withRouter } from 'react-router';

// Base class: BasePage
class BasePage extends React.Component {
	constructor(props) {
		super(props);
		//console.log('bp:', props);
	}

	componentDidMount() {
		this._checkLoggedIn();
	}

	// shouldComponentUpdate(nextProps, nextState) {
	// 	var result = this._checkLoggedIn().then(() => {
	// 		return resolve(true);
	// 	}).catch(() => {
	// 		return resolve(false);
	// 	});
	//
	// 	return result;
	// }

	_checkLoggedIn() {
		return this._isUserLoggedIn().then(trueOrFalse => {
			if (!trueOrFalse) {
				hashHistory.push({pathname: '/login'});
				//resolve();
			}
		}).catch(err => {
			console.log("err", err);
			hashHistory.push({pathname: '/error'});
			//reject();
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
		return cookie.load('currentUser');
	}

	GetCurrentUserType() {
		let data = this.GetUserLogged();

		if (data === undefined || data.roles === undefined || data === null || data.roles === null)
			return null;

		if (data.roles.includes('admin')) return 'admin';
		if (data.roles.includes('resourceManager')) return 'resourcemanager';
		if (data.roles.includes('approver')) return 'approver';
		if (data.roles.includes('searcher')) return 'searcher';

		return 'employee';
	}

	EmployeeHasRole(roleName) {
		let data = this.GetUserLogged();

		return data ? data.roles.includes(roleName) : false;
	}

	EmployeeHasAnyRole(roleNameList) {
		return roleNameList.some(roleName => this.EmployeeHasRole(roleName));
	}

	GetMyRootPath() {
		let currentUserType = this.GetCurrentUserType();
		if (currentUserType === null) return '/login';
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

	LogIn(username, password) {
		return new Promise((resolve, reject) => {
			let session = new SessionServices();
	    session.Login(username, password).then(data => {
	      cookie.save('currentUser', data);
	      cookie.save('currentUserType', this.GetCurrentUserType());
	      hashHistory.push({pathname: this.GetMyRootPath()});
				resolve();
	    }).catch((e) => {
				reject()
			});
		});
	}

	LogOut() {
		let session = new SessionServices();

    session.Logout().then(data => {
      cookie.remove('currentUser', { path: '/' });
      hashHistory.push({pathname: '/'});
    });
	}

	// GetSearchState() {
	// 	let searchServices = new SearchServices();
	// 	return searchServices.GetSearchStateFromLocationQuery(this.props.location.query);
	// }
}

BasePage.contextTypes = {
  	router: React.PropTypes.object.isRequired
}

export default BasePage;
