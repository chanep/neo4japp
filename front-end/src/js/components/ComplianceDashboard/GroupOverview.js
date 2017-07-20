import React from "react";
import { Link } from "react-router";

import DonutChart from '../DonutChart';
import {gaDashboardViewDashboard} from '../../services/GoogleAnalytics';

export default class GroupOverview extends React.Component {
  render () {
    let value = this.props.data.activeUsers.length;
    let total = this.props.data.activeUsers.length + this.props.data.inactiveUsers.length;
    let percent = total > 0 ? Math.round( value / total * 100) : 0;

    return (
      <div className="compliance-dashboard-item">
        <div className="compliance-dashboard-item__header">Searchable Employees</div>
        <div className="compliance-dashboard-item__detail-list">
          <Link to={this.props.location.pathname + '/active'} className="compliance-dashboard-item__detail" onClick={gaDashboardViewDashboard.bind(this, "Compliance", "Active Users")}>
            <div className="compliance-dashboard-item__detail-title">Active Users</div>
            <div className="compliance-dashboard-item__detail-value">{this.props.data.activeUsers.length}</div>
            <div className="compliance-dashboard-item__detail-cta">more <span className="ss-icon-right-arrow"></span></div>
          </Link>
          <Link to={this.props.location.pathname + '/inactive'} className="compliance-dashboard-item__detail" onClick={gaDashboardViewDashboard.bind(this, "Compliance", "Inactive Users")}>
            <div className="compliance-dashboard-item__detail-title">Inactive Users</div>
            <div className="compliance-dashboard-item__detail-value">{this.props.data.inactiveUsers.length}</div>
            <div className="compliance-dashboard-item__detail-cta">more <span className="ss-icon-right-arrow"></span></div>
          </Link>
          <div className="compliance-dashboard-item__detail compliance-dashboard-item__detail--wide">
            <div className="compliance-dashboard-item__detail-title">Compliance</div>
            <figure>
              <DonutChart value={this.props.data.activeUsers.length} total={this.props.data.activeUsers.length + this.props.data.inactiveUsers.length} />
              <figcaption className="compliance-dashboard-item__detail-value">{percent}%</figcaption>  
            </figure>
            </div>
        </div>
      </div>
    );
  }
}
