import React from "react";
import { Link } from "react-router";

export default class GroupDetail extends React.Component {
  constructor(props) {
      super(props);

      this.state = {
          users: (props.showActive ? props.data.activeUsers : props.data.inactiveUsers)
      };
  }

  componentWillReceiveProps(props) {
    this.state = {
        users: (props.showActive ? props.data.activeUsers : props.data.inactiveUsers)
    };
  }

  toggleUserPanel(userId) {
    console.log(userId);
  }

  render () {
    return (
      <div>
        {this.props.showActive ? 'active' : 'inactive' } group detail: ({this.state.users.length})

        <table className="compliance-dashboard-table">
          <thead>
            <tr>
              <th colSpan="3">Name</th>
            </tr>
          </thead>
          <tbody>
            {this.state.users.map(user =>
              <tr key={user.id}>
                <td className="compliance-dashboard-table__checkbox">check</td>
                <td className="compliance-dashboard-table__name">{user.fullname}</td>
                <td className="compliance-dashboard-table__action"><button onClick={() => this.toggleUserPanel(user.id)}><span className="ss-icon-left-arrow"></span></button></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }
}
