import React from "react";

import Search from "./Header/Search";
import cookie from 'react-cookie';
import { hashHistory, Link, browserHistory, withRouter } from 'react-router'
import SessionServices from '../services/SessionServices'

class Header extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      'search': props.search,
      'loggedIn': props.loggedIn,
      'userLogged': cookie.load('currentUser')
    }
  }

  logout(e) {
    
    let session = new SessionServices();

    session.Logout().then(data => {
      cookie.remove('currentUser', { path: '/' });
      this.context.router.push({pathname: '/'});
    });
  }

  render () {
    return (
        <header>
          <div className="header-wrapper">
            <h1><img src="img/rga-logo.png"></img></h1>
            <div className="header-menu-wrapper">
              {this.state.loggedIn &&
                <div className="allocations-btn">
                  {/*<span className="ss-icon-view"></span>View Allocations*/}
                  {(this.state.userLogged && this.state.userLogged.image ?
                    <img src={this.state.userLogged.image}></img>
                    :<img src="/img/img_noPortrait.gif"></img>
                  )}
                  <ul className="header-menu">
                    <li className="header-menu__item header-menu__item--title">{this.state.userLogged.fullname}</li>
                    <li className="header-menu__item"><Link to="/employeeProfile">Your Skills</Link></li>
                    <li className="header-menu__item"><a href="#">Your Work</a></li>
                    <li className="header-menu__item"><a href="#">Your Allocations</a></li>
                    <li className="header-menu__item"><a href="#">Manage Skills</a></li>
                    <li className="header-menu__item"><a href="#">FAQ</a></li>
                    <li className="header-menu__item"><input type="button" onClick={this.logout.bind(this)} value="Logout" /></li>
                  </ul> 

                </div>
              }
            </div>
          </div>
          { (this.state.search ? <Search /> :
            <div className="search">
              <div className="search__input__wrapper">
                <div className="search__input">
                  <div className="search-field-wrapper"></div>
                </div>
              </div>
            </div>
          )}
        </header>
    );
  }
}

Header.contextTypes = {
    router: React.PropTypes.object.isRequired
}

export default Header;