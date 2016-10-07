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

        this.employeeServices.GetEmployeeSkills(false).then(data => {

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
            <div className="search-results-table">
            {    
                this.state.searching ?
                    <div className="searching">Searching...</div>
                :                    
                    this.state.skills.map(function(obj, key) {
                        return (<EmployeeSkillsGroup groupData={obj} key={key} />);
                    })
            }
            </div>
        );
    }
}
