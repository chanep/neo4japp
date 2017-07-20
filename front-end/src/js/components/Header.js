import React from "react";
import Search from "./Header/Search";
import { hashHistory, Link, IndexLink, browserHistory, withRouter } from 'react-router';
import SessionServices from '../services/SessionServices';
import BasePage from '../pages/BasePage';
import {gaDashboardMenu} from "../services/GoogleAnalytics";

class Header extends React.Component {
  constructor (props) {
    super(props);

    this.base = new BasePage();

    this.state = {
      'search': props.search,
      'searchState': props.searchState,
      'loggedIn': props.loggedIn,
      'userLogged': props.userData
    }
  }

  componentWillReceiveProps(newProps) {
		this.setState({
      'search': newProps.search,
      'searchState': newProps.searchState,
      'loggedIn': newProps.loggedIn,
      'userLogged': newProps.userData
    });
	}

  sendMenuEvent(clickText){
    gaDashboardMenu(clickText, this.base.GetCurrentUserType());
  }

  logout(e) {
    this.sendMenuEvent("Log Out");
    this.base.LogOut();
  }

  render () {

    return (
        <header>
          <div className="header-wrapper">
            <Link to={this.base.GetMyRootPath()}><h1><img src="img/rga-logo.png"></img></h1></Link>
            <div className="header-menu-wrapper">
              {this.state.loggedIn &&
                <div className="allocations-btn" onMouseEnter={this.sendMenuEvent.bind(this, "")}>
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
                      <Link to="/myprofile" activeClassName="active" onClick={this.sendMenuEvent.bind(this, "My Skills")}>My Skills</Link>
                      {this.base.EmployeeHasAnyRole(['admin','resourceManager','resourcemanager','searcher']) ? <IndexLink to="/dashboards" activeClassName="active" onClick={this.sendMenuEvent.bind(this, "Dashboards")}>Dashboards</IndexLink> : null}
                      {this.base.EmployeeHasAnyRole(['admin','approver','employee']) ? <a href={'http://square/people/' + this.state.userLogged.username + '/'} target="_blank" onClick={this.sendMenuEvent.bind(this, "My Work")}>My Work</a> : null}
                      {this.base.EmployeeHasAnyRole(['admin','approver','employee']) ? <a href="http://reporter/newallocations/EmployeeAllocation.aspx" target="_blank" onClick={this.sendMenuEvent.bind(this, "My Allocations")}>My Allocations</a>: null}
                      {this.base.EmployeeHasAnyRole(['approver']) ? <Link to="/managerhome" activeClassName="active" onClick={this.sendMenuEvent.bind(this, "My Team")}>My Team</Link> : null}
                      <input type="button" onClick={this.logout.bind(this)} value="Log Out" />
                    </div>
                  </div>

                </div>
              }
            </div>
            
          </div>
          { (this.state.search ? <Search searchState={this.props.searchState} currentPathname={this.props.currentPathname} /> :
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
