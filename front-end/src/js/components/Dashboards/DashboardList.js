import React from "react";
import { Link } from "react-router";
import {gaDashboardViewDashboard} from '../../services/GoogleAnalytics';

export default class DashboardList extends React.Component {
  render () {
    return (
      <div className="dashboard-list">
          <Link to="/dashboards/compliance" onClick={gaDashboardViewDashboard.bind(this, "Compliance", "")} className="dashboard-link">Compliance</Link>
      </div>
    );
  }
}
