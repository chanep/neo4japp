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

		this.state = {
      		userLogged: cookie.load('currentUser')
    	}
	}

	_checkLoggedIn() {
		this._isUserLoggedIn().then(trueOrFalse => {
			if (!trueOrFalse) {
				console.log("no esta logueado");
				this.context.router.push({pathname: '/login'});
				console.log("no hizo redirect");
			} else {
				console.log("esta logueado");
			}
		});
	}

	_isUserLoggedIn() {
		let session = new SessionServices();
		return session.CheckLoggedIn().then(status => {
			return status;
		});
	}
}

BasePage.contextTypes = {
  	router: React.PropTypes.object.isRequired
}

export default BasePage;