import React from "react";
import { Link } from "react-router";

import DropdownMenu from '../DropdownMenu';
import UserServices from '../../services/UserServices';

export default class GroupDetail extends React.Component {
  constructor(props) {
      super(props);

      this.userData = new UserServices();
      this.setInitialState(props);
  }

  componentWillReceiveProps(props) {
    this.setInitialState(props);
  }

  setInitialState(props) {
    let users = props.showActive ? props.data.activeUsers : props.data.inactiveUsers;

    this.state = {
        title: props.showActive ? 'Active Users' : 'Inactive Users',
        users: users.map(user => Object.assign({}, user, {checked: false, open: false, title: '', manager: '', detailsLoadStatus: 'not-loaded'}))
    };
  }

  selectAll() {
    this.setState((prevState) => {
      return {users: prevState.users.map(user => Object.assign({}, user, {checked: true}))};
    });
  }

  deselectAll() {
    this.setState((prevState) => {
      return {users: prevState.users.map(user => Object.assign({}, user, {checked: false}))};
    });
  }

  sendEmail() {
    let emailList = this.state.users.reduce((accumulator, user) => {
      if(user.checked) {
        accumulator.push(user.email);
      }

      return accumulator;
    }, []);

    let emailUrl = 'mailto:?bcc=' + emailList.join(',');

    window.location = emailUrl;
  }

  toggleUserPanel(userId) {
    this.setState((prevState) => {
      let users = prevState.users,
          userIndex = users.findIndex(user => user.id === userId);

      users[userIndex].open = !users[userIndex].open;

      this.getUserDetails(userId);

      return {users};
    });
  }

  toggleUserChecked(userId) {
    this.setState((prevState) => {
      let users = prevState.users,
          userIndex = users.findIndex(user => user.id === userId);

      users[userIndex].checked = !users[userIndex].checked;

      return {users};
    });
  }

  getUserDetails(userId) {
    let user = this.state.users.find(user => user.id === userId);

    if(user.detailsLoadStatus == 'loaded' || user.detailsLoadStatus == 'loading') {
      return;
    } else {
      user.detailsLoadStatus = 'loading';

      this.userData.GetUserData(userId).then(data => {
        this.setState((prevState) => {
          let users = prevState.users,
              userIndex = users.findIndex(user => user.id === userId);

          users[userIndex].title = data.position.name;
          users[userIndex].manager = data.approvers[0].fullname;
          users[userIndex].detailsLoadStatus = 'loaded';

          return {users};
        });
      });
    }
  }

  render () {
    return (
      <div>
        <div className="compliance-dashboard-table__header">
          <div className="compliance-dashboard-table__header-text">{this.state.title} ({this.state.users.length})</div>
          <DropdownMenu items={[
            {title: 'Select All', action: () => this.selectAll(), disabled: this.state.users.length > 100},
            {title: 'Deselect All', action: () => this.deselectAll()},
            {title: 'Send Email', action: () => this.sendEmail(), disabled: !this.state.users.some(user => user.checked)},
          ]} align="right" />
        </div>
        <table className="compliance-dashboard-table">
          <thead>
              {this.props.showActive ?
                <tr>
                  <th colSpan="1"></th>
                  <th colSpan="1">Name</th>
                  <th colSpan="2">Skills</th>
                </tr>
              :
                <tr>
                  <th colSpan="1"></th>
                  <th colSpan="3">Name</th>
                </tr>
              }
          </thead>
          <tbody>
            {this.state.users.map(user =>
              <tr key={user.id} className={user.open ? 'open' : 'closed' }>
                <td className="compliance-dashboard-table__checkbox">
                  <input type="checkbox" checked={user.checked} onChange={() => this.toggleUserChecked(user.id)} />
                </td>
                <td className="compliance-dashboard-table__name">
                  <div>
                    {user.fullname}
                    <div className="compliance-dashboard-table__name-details">
                      {user.title}<br />
                      Manager: <strong>{user.manager}</strong>
                    </div>
                  </div>
                </td>
                {this.props.showActive ?
                  <td className="compliance-dashboard-table__skills">{user.skillsCount}</td>
                : null}
                <td className="compliance-dashboard-table__action"><button onClick={() => this.toggleUserPanel(user.id)}><span className="ss-icon-left-arrow"></span></button></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }
}
