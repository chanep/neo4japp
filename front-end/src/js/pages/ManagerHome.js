/**
 * Pages: ManagerHome
 */

// Dependencies
import React from 'react';
import Header from '../components/Header';
import ManagerHomeTable from '../components/ManagerHomeTable';

// Class: ManagerHome
export default class ManagerHome extends React.Component {
    render() {
        return (
            <div>
                <Header search={true} loggedIn={true} />
                <ManagerHomeTable />
            </div>
        );
    }
}
