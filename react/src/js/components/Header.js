import React from "react";

import SearchWrapper from "./Header/SearchWrapper";

import { Link } from "react-router";

export default class Header extends React.Component {
  constructor (search, loggedIn) {
    super();
    this.state = {'search': search, 'loggedIn': loggedIn};
  }

  render () {
    return (
        <header>
          <div className="header-wrapper">
            <h1><img src="img/rga-logo.png"></img></h1>
            { this.props.loggedIn && <Link to="allocations" className="allocations-btn"><span className="icon-view"></span>View Allocations <img src="img/profile-pic.png"></img></Link> }
          </div>
          { this.props.search && <SearchWrapper /> }
        </header>
    );
  }
}