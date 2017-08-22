import React from "react";
import { Link } from "react-router";

export default class DashboardList extends React.Component {
  render () {
    return (
      <div className="dashboard-list">
          <Link to="/dashboards/compliance" className="dashboard-link">Compliance</Link>
      </div>
    );
  }
}
