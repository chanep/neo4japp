// Dependencies
import React from 'react';
import cookie from 'react-cookie';
import SessionServices from '../services/SessionServices'

// Base class: BasePage
export default class BasePage extends React.Component {
	constructor(props) {
		super(props);

		this._checkLogin();

		this.state = {
      		userLogged: cookie.load('currentUser')
    	}
	}

	_checkLogin() {
		let session = new SessionServices();
		session.CheckLoggedIn().then(() => {
			console.log('ESTA LOGEADO');
		}).catch(() => {
			console.log('NO ESTA LOGEADO');
			this.context.router.push('/login')
		});
	}
}