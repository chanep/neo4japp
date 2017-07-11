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
        this.setState({loading: true});
        if (employeeId !== undefined) {
            this.userServices.GetEmployeeSkills(employeeId, false).then(data => {
                this.setState({
                    employeeId: employeeId,
                    data: data,
                    loading: false
                });
            }).catch(err => {
                console.log("Error getting employee skills", err);
            });
        }
    }

    render() {
        return (
            <div className="body-layout">
                <EmployeeHeader userId={this.state.employeeId} showActions={false} showForManagerVerification={true} />
                <div className="search-results-table">
                    <div className="verification-notes">
                        Skills in <span className="unverified">red</span> have been selected by your team member. If you agree
                        with that level, simply click to verify the skill and it will turn <span className="verified">grey</span>.<br />
                        If you don't agree with the level, leave it alone and keep it red and unverified.
                    </div>
                    {this.state.loading ?
                        <div className="loading-data-note"><span>loading data...</span></div>
                        :
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
