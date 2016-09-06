import React from "react";

import { Link } from "react-router";

import Header from "../components/Header";

export default class Login extends React.Component {
	render () {
        return (
          <div>
	          <Header search={false} loggedIn={false} />
	    	  <div className="main-content">
			      <div className="login">
			        <h1>Welcome!<br />Please log in to continue.</h1>
			        <span className="icon-user"></span><input type="text" placeholder="User Name" />
			        <span className="icon-password"></span><input type="password" placeholder="Password" />
			        <input type="submit" value="LOG IN" />
			      </div>
		      </div>
	      </div>
        );
    }
} 
