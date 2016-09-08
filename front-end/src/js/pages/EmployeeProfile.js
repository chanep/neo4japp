// Dependencies
import React from 'react';
import Header from '../components/Header';
import EmployeeHeader from "../components/EmployeeProfile/EmployeeHeader";

export default class EmployeeProfile extends React.Component {
    render () {
        return (
            <div>
                <Header search={true} loggedIn={true} />
                <EmployeeHeader />
            </div>
        );
    }
}