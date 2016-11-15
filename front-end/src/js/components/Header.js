import React from "react";

import Search from "./Header/Search";
import cookie from 'react-cookie';
import { hashHistory, Link, browserHistory, withRouter } from 'react-router';
import SessionServices from '../services/SessionServices';
import BasePage from '../pages/BasePage';

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
    let base = new BasePage();

    let currentUserType = base.GetCurrentUserType();
    let menuClass = 'approver-menu';
    if (currentUserType === 'resourcemanager') menuClass = 'resource-manager-menu';
    if (currentUserType === 'employee') menuClass = 'employee-menu'

    return (
        <header>
          <div className="header-wrapper">
            <Link to={base.GetMyRootPath()}><h1><img src="img/rga-logo.png"></img></h1></Link>
            <div className="header-menu-wrapper">
              {this.state.loggedIn &&
                <div className="allocations-btn">
                  {/*<span className="ss-icon-view"></span>View Allocations*/}
                  {(this.state.userLogged && this.state.userLogged.image ?
                    <div className="header-menu--opener">
                      <i className="ss-icon-down-arrow"></i>
                      <img src={this.state.userLogged.image}></img>
                    </div>
                    : <div className="header-menu--opener">
                        <i className="ss-icon-down-arrow"></i>
                        <img src="/img/img_noPortrait.gif"></img>
                      </div>
                  )}
                  <ul className={"header-menu " + menuClass}>
                    <li className="header-menu__item header-menu__item--title">{this.state.userLogged.fullname}</li>
                    <li className="header-menu__item"><Link to="/myprofile">My skills</Link></li>
                    {currentUserType === 'admin' || currentUserType === 'approver' || currentUserType === 'employee'? <li className="header-menu__item"><a href={'http://square/people/' + this.state.userLogged.username + '/'} target="_blank">My work</a></li> : null}
                    {currentUserType === 'admin' || currentUserType === 'approver' || currentUserType === 'employee'? <li className="header-menu__item"><a href="http://reporter/newallocations/EmployeeAllocation.aspx" target="_blank">My allocations</a></li>: null}
                    {currentUserType === 'admin' || currentUserType === 'approver'? <li className="header-menu__item"><Link to="/managerhome">Manage skills</Link></li>: null}
                    <li className="header-menu__item"><input type="button" onClick={this.logout.bind(this)} value="Logout" /></li>
                  </ul> 

                </div>
              }
            </div>
          </div>
          { (this.state.search ? <Search skillsIds={this.props.skillsIds} /> :
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