/**
 * Components: EmployeeVerification.js
 */

// Dependencies
import React from 'react';
import { Router, Route, IndexRoute, hashHistory } from "react-router";
import BasePage from './BasePage';
import Header from '../components/Header';
import EmployeeHeader from "../components/EmployeeProfile/EmployeeHeader";
import EmployeeSkillsGroup from "../components/EmployeeProfile/EmployeeSkillsGroup";
import UserServices from "../services/UserServices";

// Class: EmployeeVerification
export default class EmployeeVerification extends BasePage {
    constructor(props) {
        super(props);

        console.log("props", props);
        this.state = {
        	employeeId: 0,
            data: []
        };

        this.userServices = new UserServices();
    }

    componentDidMount() {
        this.getEmployeeSkills(this.props.params.employeeID);
    }

    componentWillReceiveProps(nextProps) {
        this.getEmployeeSkills(nextProps.employeeID);
    }

    getEmployeeSkills(employeeId) {
        if (employeeId !== undefined) {
            this.userServices.GetEmployeeSkills(employeeId, false).then(data => {
                this.setState({
                    employeeId: employeeId,
                    data: data
                });
            }).catch(err => {
                console.log("Error getting employee skills", err);
            });
        }
    }

    render() {
        return (
            <div className="body-layout">
                <Header search={false} loggedIn={true} />
                <EmployeeHeader userId={this.state.employeeId} showActions={false} showForManagerVerification={true} />
                <div className="search-results-table">
                    {
                    this.state.data.length > 0?
                        this.state.data.map(function(obj, key) {
                            return (<EmployeeSkillsGroup groupData={obj} key={key} approverMode={true} />);
                        })
                    : null
                    }
                </div>
            </div>
        );
    }
}