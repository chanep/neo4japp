/**
 * Pages: Dashboards
 */

// Dependencies
import React from 'react';
import BasePage from './BasePage';
import Header from '../components/Header';

// Class: Dashboards
export default class Dashboards extends BasePage {
    render() {
        return (
            <div>
                <Header search={super._showSearch()} loggedIn={true} />
                <div className="body-layout dashboards-container">
                    <div className="dashboard-link">hi</div>
                    <div className="dashboard-link">hi</div>
                    <div className="dashboard-link">hi</div>
                    <div className="dashboard-link">hi</div>
                    <div className="dashboard-link">hi</div>
                </div>
            </div>
        );
    }
}
