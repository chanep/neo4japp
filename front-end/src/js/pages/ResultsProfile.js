/**
 * Pages: ResultsProfile
 */

// Dependencies
import React from 'react';
import BasePage from './BasePage';
import Header from '../components/Header';
import EmployeeHeader from "../components/EmployeeProfile/EmployeeHeader";
import ResultsProfileTable from "../components/ResultsProfileTable";

// Class: ResultsProfile
export default class ResultsProfile extends BasePage {
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
