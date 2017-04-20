/**
 * Pages: Compliance Dashboard
 */

// Dependencies
import React from 'react';
import BasePage from './BasePage';
import Header from '../components/Header';

// Class: Dashboards
export default class ComplianceDashboard extends BasePage {
    render() {
        return (
            <div>
                <Header search={super._showSearch()} loggedIn={true} />
                <div className="body-layout compliance-dashboard-container">
                    <div className="compliance-dashboard__header">Compliance Dashboard</div>
                    <div className="compliance-dashboard__body">
                      <div className="compliance-dashboard__sidebar col -col-3 -col-no-gutter">
                        <a href="#">San Francisco (250)</a>
                        <a href="#">San Francisco (250)</a>
                        <a href="#">San Francisco (250)</a>
                        <a href="#">San Francisco (250)</a>
                        <a href="#">San Francisco (250)</a>
                      </div>
                      <div className="compliance-dashboard__content col -col-9 -col-no-gutter">hi</div>
                    </div>
                </div>
            </div>
        );
    }
}
