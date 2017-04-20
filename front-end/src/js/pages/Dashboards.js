/**
 * Pages: Dashboards
 */

// Dependencies
import React from 'react';
import { Link } from "react-router";
import BasePage from './BasePage';
import Header from '../components/Header';

// Class: Dashboards
export default class Dashboards extends BasePage {
    render() {
        return (
            <div>
                <Header search={super._showSearch()} loggedIn={true} />
                <div className="body-layout dashboards-container">
                    <Link to="/dashboards/compliance" className="dashboard-link">Compliance</Link>
                </div>
            </div>
        );
    }
}
