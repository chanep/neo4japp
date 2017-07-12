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
            userId: super.GetUserLogged().id
        };
	}

    render() {
        return (
            <div>
	              <EmployeeHeader userId={this.state.userId} addSkills={false} showActions={true} />
	              <EmployeeAddSkillsTable userId={this.state.userId} />
            </div>
        );
    }
}
