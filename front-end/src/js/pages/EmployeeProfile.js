// Dependencies
import React from 'react';
import { Router, Route, IndexRoute, hashHistory } from "react-router";
import BasePage from './BasePage';
import Header from '../components/Header';
import EmployeeHeader from "../components/EmployeeProfile/EmployeeHeader";
import ResultsProfileTable from "../components/ResultsProfileTable";
import RelatedEmployees from '../components/EmployeeProfile/RelatedEmployees';

export default class EmployeeProfile extends BasePage {
	constructor(props){
		super(props);

        this.state = {
            userId: null
        }
	}

    componentDidMount() {
        let userId = null;
        if (this.props.params.employeeID !== undefined)
            userId = this.props.params.employeeID;

    	this.setState({userId: userId});
    }

    componentWillReceiveProps(newProps) {
    	let userId = null;
        if (newProps.params.employeeID !== undefined)
            userId = newProps.params.employeeID;

        this.setState({userId: userId});
     }

    render () {
        return (
            <div>
                <Header search={super._showSearch()} loggedIn={true} />
                <EmployeeHeader employee={this.state.user} addSkills={true} />
                <ResultsProfileTable employeeId={this.state.user.id} />
                <RelatedEmployees userId={this.state.user.id} />
            </div>
        );
    }
}