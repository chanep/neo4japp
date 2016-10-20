/**
 * Pages: ManagerHome
 */

// Dependencies
import React from 'react';
import BasePage from './BasePage';
import Header from '../components/Header';
import ManagerHomeTable from '../components/ManagerHomeTable';

// Class: ManagerHome
export default class ManagerHome extends BasePage {
    render() {
        return (
            <div>
                <Header search={false} loggedIn={true} />
                <div className="body-layout">
                	<ManagerHomeTable />
                </div>
            </div>
        );
    }
}
