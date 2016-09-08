import React from "react";

import { Link} from "react-router";

import Header from "../components/Header";

export default class Login extends React.Component {
	constructor(){
		super();
	}

	query(e) {
		e.preventDefault();

      console.log("queryyy");
      let params = JSON.stringify({'username':'fabriciom','password':'skill123'});
      const queryURL = 'http://localhost:15005/api/session/';
      var request = new XMLHttpRequest();
      request.open("POST", queryURL, true);
      request.withCredentials = true;
      request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");


      request.onreadystatechange = function () {

        console.log(request.status);
        if (request.readyState != 4 || request.status != 200) {
          console.log("ERROR");
          return;
        }
        var data = request.responseText;
        console.log(JSON.parse(data));
        // this.props.history.push('/');
      };
    

      request.send(params);
    }
	render () {
        return (
          <div>
	          <Header search={false} loggedIn={false} />
	    	  <div className="main-content">
			      <div className="login">
			        <h1>Welcome!<br />Please log in to continue.</h1>
			        <span className="icon-user"></span><input type="text" placeholder="User Name" />
			        <span className="icon-password"></span><input type="password" placeholder="Password" />
			        <input type="submit" onClick={this.query.bind(this)}  value="LOGEATE2 IN" />
			      </div>
		      </div>
	      </div>
        );
    }
}
