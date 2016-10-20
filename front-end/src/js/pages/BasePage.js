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
		let data = cookie.load('currentUser');
		return (data.roles.includes('admin') || data.roles.includes('resourceManager'));
	}

	GetUserLogged() {
		let data = cookie.load('currentUser');
		return data;
	}

	GetMyRootPath() {
		let data = cookie.load('currentUser');

		if (data === undefined || data.roles === undefined || data === null || data.roles === null)
			return '/login';

		if (data.roles.includes('admin') || data.roles.includes('resourceManager')) {
        	return '/resourceshotspot';
      	}
      	else
        	if (data.roles.includes('approver')){
          		return '/managerhome';
        	}
        	else {
          		return '/myprofile';
        	}

        return '/';
	}
}

BasePage.contextTypes = {
  	router: React.PropTypes.object.isRequired
}

export default BasePage;