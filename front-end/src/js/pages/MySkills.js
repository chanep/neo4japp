/**
 * Pages: MySkills
 */

// Dependencies
import React from 'react';
import BasePage from './BasePage';
import Header from '../components/Header';
import EmployeeHeader from "../components/EmployeeProfile/EmployeeHeader";
import UserServices from '../services/UserServices';

// Class: MySkills
export default class MySkills extends BasePage {
	constructor(props) {
		super(props);

        this.userData = new UserServices();
        this.state = {
            user: []
        }
	}

    getData() {
        this.userData.GetUserData(null).then(data => {
            let skillsCount = 0;
            data.skillGroups.forEach(obj => {
                skillsCount += obj.skills.length;
            });

            this.setState({
                user: data,
                skillsCount: skillsCount
            });
        }).catch(data => {
          
            console.log("user data error", data);
          
        });
    }

    componentDidMount() {
        this.getData();
    }

    componentWillReceiveProps(newProps) {
        this.getData();
    }

    render() {
        return (
            <div>
                <Header search={true} loggedIn={true} />
                <EmployeeHeader employee={this.state.user} skillsCount={this.state.skillsCount} />
            </div>
        );
    }
}