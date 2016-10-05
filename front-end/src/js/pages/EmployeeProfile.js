// Dependencies
import React from 'react';
import { Router, Route, IndexRoute, hashHistory } from "react-router";
import BasePage from './BasePage';
import Header from '../components/Header';
import EmployeeHeader from "../components/EmployeeProfile/EmployeeHeader";
import ResultsProfileTable from "../components/ResultsProfileTable";
import RelatedEmployees from '../components/EmployeeProfile/RelatedEmployees';
import UserServices from '../services/UserServices';

export default class EmployeeProfile extends BasePage {
	constructor(props){
		super(props);

        this.state = {
            user: []
        }
        this.userData = new UserServices();
        this.isReady = false;
	}

    getUser() {
    	console.log("entro aca");
    	let userId = null;
    	if (this.props.params.employeeID !== undefined)
    		userId = this.props.params.employeeID;

    	console.log('this.props.params.employeeID', this.props.params.employeeID);
    	console.log('neeeewwwww', userId);

        this.userData.GetUserData(userId).then(data => {
            this.setState({user:data});

            let skillsCount = 0;
            this.state.user.skillGroups.forEach(obj => {
                skillsCount += obj.skills.length;
            });

            this.setState({skillsCount:skillsCount});
        }).catch(data => {
          
            console.log("user data error", data);
          
        });

    }

    componentDidMount() {
    	this.getUser();
        this.isReady = true;
    }

    componentWillReceiveProps(props) {
        this.getUser();
        this.isReady = true;
     }

    render () {
        return (
            <div>
                <Header search={super._showSearch()} loggedIn={true} />
                <EmployeeHeader employee={this.state.user} skillsCount={this.state.skillsCount} />
                <ResultsProfileTable /> 
                <RelatedEmployees />
            </div>
        );
    }
}