/**
* Pages: Compliance Dashboard
*/

// Dependencies
import React from 'react';
import { Link, hashHistory } from "react-router";

import SkillsServices from "../../services/SkillsServices";
import UserServices from "../../services/UserServices";
import BasePage from '../../pages/BasePage';
import OfficeMap from "../OfficeMap";

// Class: Dashboards
export default class ComplianceDashboard extends React.Component {
  constructor(props) {
    super(props);

    //console.log(this.props.params.employeeGroup);

    this.state = {
      activeGroup: {},
      groups: [],
      inactiveUsers: [],
      activeUsers: [],
      myTeam: [],
    }

    this.skillsServices = new SkillsServices();
    this.userServices = new UserServices();

    this.userData = this.fetchUserData();
    this.userData.then(userData => this.openGroup(userData, this.props.params.employeeGroup));
  }

  userHasGroup(userData, groupShortName) {
    return userData.groups.some(group => group.shortName == groupShortName);
  }

  openGroup(userData, groupShortName) {
    if(groupShortName && this.userHasGroup(userData, groupShortName)) {
      this.setState(this.getUserDataForGroup(userData, groupShortName));
    } else if(this.userHasGroup(userData, 'myresources')) {
      hashHistory.push('/dashboards/compliance/myresources/');
    } else if(this.userHasGroup(userData, 'myteam')) {
      hashHistory.push('/dashboards/compliance/myteam/');
    } else {
      hashHistory.push('/dashboards/compliance/all/');
    }


  }



  getUserDataForGroup(userData, groupShortName) {
    function filterData(users) {
      switch (groupShortName) {
        case 'all':
          return users;
          break;
        case 'myresources':
          return users.filter(user => userData.myResources.includes(user.id));
          break;
        case 'myteam':
          return users.filter(user => userData.myTeam.includes(user.id));
          break;
        default:
          return users.filter(user => user.office.acronym.toLowerCase() === groupShortName);
          break;
      }
    }

    return {
      activeGroup: userData.groups.find(group => group.shortName === groupShortName),
      groups: userData.groups,
      inactiveUsers: filterData(userData.inactiveUsers),
      activeUsers: filterData(userData.activeUsers)
    }
  }

  fetchUserData() {
    return new Promise((resolve, reject) => {
      let base = new BasePage();
      let teamPromise = base.EmployeeHasRole('approver') ? this.userServices.GetMyTeam() : Promise.resolve([]);
      let resourcesPromise = base.EmployeeHasRole('resourceManager') ? this.userServices.GetMyResources() : Promise.resolve([]);

      Promise.all([this.skillsServices.GetUsersBySkillStatus(2000, true),this.skillsServices.GetUsersBySkillStatus(2000, false), teamPromise, resourcesPromise])
      .then(data => {
        console.log('data[2]',data[2]);
        console.log('data[3]',data[3]);
        let userData = {
          groups: [],
          inactiveUsers: data[0],
          activeUsers: data[1],
          myTeam: data[2] ? data[2].map(user => user.id) : [],
          hasTeam: data[2].length > 0,
          myResources: data[3] ? data[3].map(user => user.id) : [],
          hasResources: data[3].length > 0
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

        if(userData.hasTeam ) {
          groupList.unshift({
            name: 'My Team',
            shortName: 'myteam',
            total: userData.myTeam.length
          });
        }

        if(userData.hasResources ) {
          groupList.unshift({
            name: 'My Resources',
            shortName: 'myresources',
            total: userData.myResources.length
          });
        }



        userData.groups = groupList;

        console.log(userData);

        resolve(userData);
      });
    });
  }

  componentWillReceiveProps(newProps){
    this.userData.then(userData => this.openGroup(userData, newProps.params.employeeGroup)); //this.setState(this.getUserDataForGroup(userData, newProps.params.employeeGroup)));
  }

  renderChildren(data) {
    return React.Children.map(this.props.children, child => {
      return React.cloneElement(child, {data})
    });
  }

  render() {

    return (
        <div className="body-layout compliance-dashboard-container">
          <div className="compliance-dashboard">
            <div className="compliance-dashboard__sidebar col -col-3 -col-no-gutter">

              {this.state.groups.map((group, index) =>
                <Link to={'/dashboards/compliance/' + group.shortName} activeClassName="active" key={index}>{group.name} ({group.total})</Link>
              )}

            </div>
            <div className="compliance-dashboard__content col -col-9 -col-no-gutter">
              <div className="compliance-dashboard__content-header">
                {this.state.activeGroup.name}
                {this.state.activeGroup.shortName !== 'all' && this.state.activeGroup.shortName !== 'myteam' && this.state.activeGroup.shortName !== 'myresources' ? <OfficeMap office={this.state.activeGroup.shortName} /> : ''}

              </div>

            <span className='dashboard-name' style={{display: 'none'}}>Compliance</span>
              {this.renderChildren(this.state)}
            </div>
          </div>
        </div>
    );
  }
}
