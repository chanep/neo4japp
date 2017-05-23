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

  doAlert() {
    alert(this.state.users.length);
  }

  toggleUserPanel(userId) {
    this.setState((prevState) => {
      let users = prevState.users,
          userIndex = users.findIndex(user => user.id === userId);

      users[userIndex].open = !users[userIndex].open;

      console.log(userId);

      this.getUserDetails(userId);

      return Object.assign({}, prevState, {users});
    });
  }

  toggleUserChecked(userId) {
    this.setState((prevState) => {
      let users = prevState.users,
          userIndex = users.findIndex(user => user.id === userId);

      users[userIndex].checked = !users[userIndex].checked;

      return Object.assign({}, prevState, {users});
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

          return Object.assign({}, prevState, {users});
        });
      });
    }
  }

  render () {
    return (
      <div>
        <div className="compliance-dashboard-table__header">
          <div className="compliance-dashboard-table__header-text">{this.state.title}</div>
          <DropdownMenu items={[
            {title: 'Select All', action: () => this.doAlert()},
            {title: 'Deselect All', action: () => this.doAlert()},
            {title: 'Send Email', action: () => this.doAlert()},
          ]} align="right" />
        </div>        
        <table className="compliance-dashboard-table">
          <thead>
            <tr>
              <th colSpan="3">Name</th>
            </tr>
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
                <td className="compliance-dashboard-table__action"><button onClick={() => this.toggleUserPanel(user.id)}><span className="ss-icon-left-arrow"></span></button></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }
}
