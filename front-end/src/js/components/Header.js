import React from "react";

import Search from "./Header/Search";
import cookie from 'react-cookie';
import { hashHistory, Link, IndexLink, browserHistory, withRouter } from 'react-router';
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
                  <div className="header-menu">
                    <div className="header-menu__item--title">{this.state.userLogged.fullname}</div>
                    <div className="header-menu__item-list">
                      <Link to="/myprofile" activeClassName="active">My Skills</Link>
                      {base.EmployeeHasAnyRole(['admin','resourcemanager','searcher']) ? <IndexLink to="/dashboards" activeClassName="active">Dashboards</IndexLink> : null}
                      {base.EmployeeHasAnyRole(['admin','approver','employee']) ? <a href={'http://square/people/' + this.state.userLogged.username + '/'} target="_blank">My Work</a> : null}
                      {base.EmployeeHasAnyRole(['admin','approver','employee']) ? <a href="http://reporter/newallocations/EmployeeAllocation.aspx" target="_blank">My Allocations</a>: null}
                      {base.EmployeeHasAnyRole(['admin','approver']) ? <Link to="/managerhome" activeClassName="active">My Team</Link> : null}
                      <input type="button" onClick={this.logout.bind(this)} value="Log Out" />
                    </div>
                  </div>

                </div>
              }
            </div>
          </div>
          { (this.state.search ? <Search skillsIds={this.props.skillsIds} interestsIds={this.props.interestsIds} clientsIds={this.props.clientsIds} /> :
            <div className="no-search-bar"></div>
          )}
        </header>
    );
  }
}

Header.contextTypes = {
    router: React.PropTypes.object.isRequired
}

export default Header;
