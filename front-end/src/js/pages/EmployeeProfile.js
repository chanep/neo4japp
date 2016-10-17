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
        let showActions = false;
        if (this.state.userId === null || this.state.userId === 0 || this.state.userId === super.GetUserLogged().id)
            showActions = true;

        return (
            <div>
                <Header search={super._showSearch()} loggedIn={true} />
                <EmployeeHeader userId={this.state.userId} addSkills={true} showActions={showActions} />
                <ResultsProfileTable employeeId={this.state.userId} />
                <RelatedEmployees />
            </div>
        );
    }
}