/**
 * Pages: MySkills
 */

// Dependencies
import React from 'react';
import BasePage from './BasePage';
import Header from '../components/Header';
import EmployeeHeader from "../components/EmployeeProfile/EmployeeHeader";
import EmployeeAddSkillsTable from "../components/EmployeeProfile/AddSkills";

// Class: MySkills
export default class MySkills extends BasePage {
	constructor(props) {
		super(props);

        this.state = {
            userId: 0
        };
	}

    render() {
        return (
            <div>
                <Header search={true} loggedIn={true} />
                <EmployeeHeader userId={this.state.userId} addSkills={false} />
                <EmployeeAddSkillsTable />
            </div>
        );
    }
}