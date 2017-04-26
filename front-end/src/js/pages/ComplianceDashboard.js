/**
 * Pages: Compliance Dashboard
 */

// Dependencies
import React from 'react';
import { Link } from "react-router";
import BasePage from './BasePage';
import Header from '../components/Header';

// Class: Dashboards
export default class ComplianceDashboard extends BasePage {
    render() {
        return (
            <div>
                <Header search={super._showSearch()} loggedIn={true} />
                <div className="body-layout compliance-dashboard-container">
                    <div className="compliance-dashboard__header"><Link to="/dashboards/" className="ss-icon-left-arrow"></Link>Compliance Dashboard</div>
                    <div className="compliance-dashboard__body">
                      <div className="compliance-dashboard__sidebar col -col-3 -col-no-gutter">
                        <Link to="/dashboards/compliance/all" activeClassName="active">All</Link>
                        <Link to="/dashboards/compliance/nyc" activeClassName="active">New York</Link>
                        <Link to="/dashboards/compliance/pdx" activeClassName="active">Portland</Link>
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
