/**
 * Pages: ResultsProfile
 */

// Dependencies
import React from 'react';
import Header from '../components/Header';
import EmployeeHeader from "../components/EmployeeProfile/EmployeeHeader";
import ResultsProfileTable from "../components/ResultsProfileTable";

// Class: ResultsProfile
export default class ResultsProfile extends React.Component {
    render() {
        return (
            <div>
                <Header search={true} loggedIn={true} />
                <EmployeeHeader />
                <ResultsProfileTable /> 
            </div>
        );
    }
}
