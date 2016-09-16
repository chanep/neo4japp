import React from "react";

import Search from "./Header/Search";
import cookie from 'react-cookie';
import { Link } from "react-router";

export default class Header extends React.Component {
  constructor (search, loggedIn) {
    super();
    this.state = {'search': search, 'loggedIn': loggedIn, userLogged: cookie.load('currentUser')};
    console.log("user", this.state.userLogged);
  }

  render () {
    return (
        <header>
          <div className="header-wrapper">
            <h1><img src="img/rga-logo.png"></img></h1>
            {this.props.loggedIn &&
              <Link to="allocations" className="allocations-btn">
                <span className="ss-icon-view"></span>View Allocations
                {(this.state.userLogged && this.state.userLogged.image ?
                  <img src={this.state.userLogged.image}></img>
                  :<img src="/img/img_noPortrait.gif"></img>
                )}
              </Link>
            }
          </div>
          { this.props.search && <Search /> }
        </header>
    );
  }

}