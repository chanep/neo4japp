import React from "react";

import { hashHistory, Link, browserHistory, withRouter } from 'react-router'

import Header from "../components/Header";
import SessionServices from '../services/SessionServices'
import cookie from 'react-cookie';

class Login extends React.Component {

	constructor(){
		super();

    this.state = {
      username: '',
      password: ''
    }
	}

  handleUsernameChange(e) {
    this.setState({username: e.target.value});
  }

  handlePasswordChange(e) {
    this.setState({password: e.target.value});
  }

  loginSubmit(e) {
    let self = this;
		e.preventDefault();

    let session = new SessionServices();
    session.Login(self.state.username, self.state.password).then(data => {
      cookie.save('currentUser', data);
      if (data.roles.includes('admin') || data.roles.includes('resourceManager'))
        this.context.router.push('/#/');
      else
        if (data.roles.includes('approver'))
          this.context.router.push('/#/ManagerHome');
        else
          this.context.router.push('/#/employeeProfile');

    }).catch(data => {
      console.log("Errorrrrr", data);
    });
  }

	render () {
        return (
          <div>
	          <Header search={false} loggedIn={false} />
	    	  <div className="main-content">
			      <div className="login">
			        <h1>Welcome!<br />Please log in to continue.</h1>
			        <span className="ss-icon-user"></span><input id="username" type="text" placeholder="User Name" onChange={this.handleUsernameChange.bind(this)} />
			        <span className="ss-icon-password"></span><input id="userPass" type="password" placeholder="Password" onChange={this.handlePasswordChange.bind(this)}/>
			        <input type="submit" onClick={this.loginSubmit.bind(this)}  value="LOG IN" />
			      </div>
		      </div>
	      </div>
        );
    }
}

Login.contextTypes = {
    router: React.PropTypes.object.isRequired
}

export default Login;