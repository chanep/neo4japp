/**
* Pages: Compliance Dashboard
*/

// Dependencies
import React from 'react';
import { Link } from "react-router";
import BasePage from './BasePage';
import Header from '../components/Header';

import SkillsServices from "../services/SkillsServices";

// Class: Dashboards
export default class ComplianceDashboard extends BasePage {
  constructor(props) {
    super(props);

    console.log(this.props.params.employeeGroup);

    this.state = {
      activeGroup: {},
      groups: [],
      inactiveUsers: [],
      activeUsers: [],
    }

    this.skillsServices = new SkillsServices();
    this.userData = this.fetchUserData();

    this.userData.then(d => console.log(d));
    this.userData.then(userData => this.setState(this.getUserDataForGroup(userData, this.props.params.employeeGroup)));
  }

  getUserDataForGroup(userData, groupShortName) {
    return {
      activeGroup: userData.groups.find(group => group.shortName === groupShortName),
      groups: userData.groups,
      inactiveUsers: (groupShortName == 'all' ? userData.inactiveUsers : userData.inactiveUsers.filter(user => user.office.acronym.toLowerCase() === groupShortName)),
      activeUsers: (groupShortName == 'all' ? userData.activeUsers : userData.activeUsers.filter(user => user.office.acronym.toLowerCase() === groupShortName))
    }
  }

  fetchUserData() {
    return new Promise((resolve, reject) => {
      Promise.all([this.skillsServices.GetUsersBySkillStatus(2000, true),this.skillsServices.GetUsersBySkillStatus(2000, false)])
      .then(data => {
        console.log(data);

        let userData = {
          groups: [],
          inactiveUsers: data[0],
          activeUsers: data[1],
        }

        let groupList = [];
        let groupData = {
          'all': {
            total: 0
          },
          'offices': {}
        };

        userData.inactiveUsers.concat(userData.activeUsers).forEach(user => {
          if(typeof groupData.offices[user.office.acronym] === 'undefined') {
            groupData.offices[user.office.acronym] = user.office;
            groupData.offices[user.office.acronym].total = 1;
          } else {
            groupData.offices[user.office.acronym].total++
          }

          groupData.all.total++;
        });

        for (var office in groupData.offices) {
          groupList.push({
            name: groupData.offices[office].name,
            shortName: groupData.offices[office].acronym.toLowerCase(),
            total: groupData.offices[office].total
          });
        }

        groupList.sort(function(a, b) {
          var nameA = a.name.toUpperCase(); // ignore upper and lowercase
          var nameB = b.name.toUpperCase(); // ignore upper and lowercase
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }

          // names must be equal
          return 0;
        });

        groupList.unshift({
          name: 'All',
          shortName: 'all',
          total: groupData.all.total
        });

        console.log(groupData);
        console.log(groupList);

        userData.groups = groupList;

        resolve(userData);
      });
    });
  }

  componentDidMount() {
    console.log(this.props);
  }

  componentWillReceiveProps(newProps) {
    this.userData.then(userData => this.setState(this.getUserDataForGroup(userData, newProps.params.employeeGroup)));
  }

  render() {


    return (
      <div>
        <Header search={super._showSearch()} loggedIn={true} />
        <div className="body-layout compliance-dashboard-container">
          <div className="compliance-dashboard__header"><Link to="/dashboards/" className="ss-icon-left-arrow"></Link>Compliance Dashboard</div>
          <div className="compliance-dashboard__body">
            <div className="compliance-dashboard__sidebar col -col-3 -col-no-gutter">

              {this.state.groups.map((group, index) =>
                <Link to={'/dashboards/compliance/' + group.shortName} activeClassName="active" key={index}>{group.name} ({group.total})</Link>
              )}

            </div>
            <div className="compliance-dashboard__content col -col-9 -col-no-gutter">
              <div className="compliance-dashboard__content-header">{this.state.activeGroup.name}</div>

              <div className="compliance-dashboard-item">
                <div className="compliance-dashboard-item__header">Searchable Employees</div>
                <div className="compliance-dashboard-item__detail-list">
                  <div className="compliance-dashboard-item__detail">
                    <div className="compliance-dashboard-item__detail-title">Active Users</div>
                    <div className="compliance-dashboard-item__detail-value">{this.state.activeUsers.length}</div>
                    <div className="compliance-dashboard-item__detail-cta">more</div>
                  </div>
                  <div className="compliance-dashboard-item__detail">
                    <div className="compliance-dashboard-item__detail-title">Inactive Users</div>
                    <div className="compliance-dashboard-item__detail-value">{this.state.inactiveUsers.length}</div>
                    <div className="compliance-dashboard-item__detail-cta">more</div>
                  </div>
                  <div className="compliance-dashboard-item__detail compliance-dashboard-item__detail--wide">
                    <div className="compliance-dashboard-item__detail-title">Compliance</div>
                    <div className="compliance-dashboard-item__detail-value">{Math.round(this.state.activeUsers.length / (this.state.activeUsers.length + this.state.inactiveUsers.length) * 100)}%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
