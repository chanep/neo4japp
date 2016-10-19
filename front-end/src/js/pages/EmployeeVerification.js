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

        this.state = {
        	employee: null
        };
    }

    componentDidMount() {
    	this.setState({
    		employee: this.props.employee
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
                <Header search={super._showSearch()} loggedIn={true} />
                <EmployeeHeader userId={this.state.userId} addSkills={true} showActions={false} />
            </div>
        );
    }
}