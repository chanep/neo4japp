import React from "react";

import { hashHistory, Link, browserHistory, withRouter } from 'react-router'

import Header from "../components/Header";
import SessionServices from '../services/SessionServices'
import BasePage from "./BasePage";

class Login extends React.Component {

	constructor(){
		super();

	    this.state = {
	      "username": '',
	      "password": '',
        "attempting": false,
        "failedAttempt": false
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
		let basePage = new BasePage();

		e.preventDefault();

    this.setState({ "attempting": true });

    basePage.LogIn(self.state.username, self.state.password).catch(data => {
      this.setState({ "failedAttempt": true });
      this.setState({ "attempting": false });
    });
  }

	render () {
        return (
	    	  <div className="main-content">
			      <div className="login">
			        <h1>Welcome!<br />Please log in to continue.</h1>
              <form onSubmit={this.loginSubmit.bind(this)}>
			         <span className="ss-icon-user"></span><input id="username" type="text" placeholder="User Name" className="inputTextBox" onChange={this.handleUsernameChange.bind(this)} />
			         <span className="ss-icon-password"></span><input id="userPass" type="password" placeholder="Password" className="inputTextBox" onChange={this.handlePasswordChange.bind(this)}/>
               <input type="submit" value="LOG IN" disabled={this.state.attempting} />
              </form>
              {this.state.failedAttempt ?
              <span className="failed-attempt">Invalid username/password. Please, try again.</span>
              : false }
			      </div>
		      </div>
        );
    }
}

Login.contextTypes = {
    router: React.PropTypes.object.isRequired
}

export default Login;
