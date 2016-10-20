/**
 * Components: EmployeeVerification.js
 */

// Dependencies
import React from 'react';
import { Router, Route, IndexRoute, hashHistory } from "react-router";
import BasePage from './BasePage';
import Header from '../components/Header';
import EmployeeHeader from "../components/EmployeeProfile/EmployeeHeader";

// Class: EmployeeVerification
export default class EmployeeVerification extends BasePage {
    constructor(props) {
        super(props);

        console.log("props", props);
        this.state = {
        	employeeId: props.params.employeeID
        };
    }

    componentDidMount() {
    	this.setState({
    		employeeId: this.props.employeeID
    	});
    }

    componentWillReceiveProps(nextProps) {
    	this.setState({
    		data: nextProps.employee
    	});
    }

    render() {
        return (
            <div className="body-layout">
                <Header search={true} loggedIn={true} />
                <EmployeeHeader userId={this.state.employeeId} showActions={false} showForManagerVerification={true} />
            </div>
        );
    }
}