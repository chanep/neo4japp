/**
 * Components: ResultsProfileTable
 */

// Dependencies
import React from 'react';
import { Link } from 'react-router'
import UserServices from "../services/UserServices";
import EmployeeSkillsGroup from "../components/EmployeeProfile/EmployeeSkillsGroup";

// Class: ResultsProfileTable
export default class ResultsProfileTable extends React.Component {
    constructor() {
        super();
        this.state = {
            employeeId: null,
            searching: true,
            skills: []
        };

        this.employeeServices = new UserServices();
    }

    getData(employeeId) {
        this.setState({
            employeeId: employeeId,
            searching: true,
            skills: []
        });

        this.employeeServices.GetEmployeeSkills(employeeId, false).then(data => {

            this.setState({
                employeeId: employeeId,
                searching: false,
                skills: data
            });

        }).catch(err => {
            console.log("Error searching all skills", err);
        });
    }

    componentWillReceiveProps(nextProps) {
        this.getData(nextProps.employeeId);
    }

    render() {
        return (
            <div className="search-results-table search-results-table--employee">
                <div className="verification-notes verification-notes--employee">
                    Skills in <span className="unverified">red</span> have not been verified by your manager yet. Skills in <span className="verified">grey</span> have been verified.<br />
                </div>
            {    
                this.state.searching ?
                    <div className="loading-data-note">Searching...</div>
                :                    
                    this.state.skills.map(function(obj, key) {
                        return (<EmployeeSkillsGroup groupData={obj} key={key} />);
                    })
            }
            </div>
        );
    }
}
