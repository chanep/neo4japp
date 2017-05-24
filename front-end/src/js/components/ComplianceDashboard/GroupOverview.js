import React from "react";
import { Link } from "react-router";

import DonutChart from '../DonutChart';

export default class GroupOverview extends React.Component {
  render () {
    return (
      <div className="compliance-dashboard-item">
        <div className="compliance-dashboard-item__header">Searchable Employees</div>
        <div className="compliance-dashboard-item__detail-list">
          <Link to={this.props.location.pathname + '/active'} className="compliance-dashboard-item__detail">
            <div className="compliance-dashboard-item__detail-title">Active Users</div>
            <div className="compliance-dashboard-item__detail-value">{this.props.data.activeUsers.length}</div>
            <div className="compliance-dashboard-item__detail-cta">more <span className="ss-icon-right-arrow"></span></div>
          </Link>
          <Link to={this.props.location.pathname + '/inactive'} className="compliance-dashboard-item__detail">
            <div className="compliance-dashboard-item__detail-title">Inactive Users</div>
            <div className="compliance-dashboard-item__detail-value">{this.props.data.inactiveUsers.length}</div>
            <div className="compliance-dashboard-item__detail-cta">more <span className="ss-icon-right-arrow"></span></div>
          </Link>
          <div className="compliance-dashboard-item__detail compliance-dashboard-item__detail--wide">
            <div className="compliance-dashboard-item__detail-title">Compliance</div>
            <figure>
              <DonutChart value={this.props.data.activeUsers.length} total={this.props.data.activeUsers.length + this.props.data.inactiveUsers.length} />
              <figcaption className="compliance-dashboard-item__detail-value">{Math.round(this.props.data.activeUsers.length / (this.props.data.activeUsers.length + this.props.data.inactiveUsers.length) * 100)}%</figcaption>  
            </figure>
            </div>
        </div>
      </div>
    );
  }
}
