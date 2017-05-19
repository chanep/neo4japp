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

    console.log(this.props);

    this.state = {
      groups: [],
      inactiveUsers: [],
      activeUsers: [],
    }

    this.skillsServices = new SkillsServices();
    this.userData = this.fetchUserData();

    this.userData.then(d => console.log(d));
    this.userData.then(d => this.setState(d));
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
    console.log(newProps);
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
      <div className="compliance-dashboard__content-header">
      San Francisco
      </div>
      </div>
      </div>
      </div>
      </div>
    );
  }
}
