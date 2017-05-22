import React from "react";
import { Link } from "react-router";

export default class GroupDetail extends React.Component {
  render () {
    return (
      <div>
        {this.props.showActive ? 'active' : 'inactive' } group detail: ({this.props.showActive ? this.props.data.activeUsers.length : this.props.data.inactiveUsers.length })
      </div>
    );
  }
}
