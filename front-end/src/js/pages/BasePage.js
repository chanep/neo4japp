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
		console.log("data", data);
		console.log(data.roles.includes('admin') || data.roles.includes('resourceManager'));
		return (data.roles.includes('admin') || data.roles.includes('resourceManager'));
	}
}

BasePage.contextTypes = {
  	router: React.PropTypes.object.isRequired
}

export default BasePage;