/**
 * Components: EmployeeAddSkillsTable
 */

// Dependencies
import React from 'react';
import { Link } from 'react-router';
import AddSkillsFilter from './AddSkillsFilter';
import UserServices from '../../services/UserServices';
import AddSkillsList from './AddSkillsList';
import BasePage from '../../pages/BasePage';
import ENV from "../../../config.js";

export default class EmployeeAddSkillsTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        	data: [],
        	selectedGroup: 0
        };

        this.userData = new UserServices();
    }

    handleFilter(selectedValue, newText) {
    	this.setState({
            selectedGroup: selectedValue,
            preselectedFilter: newText
        });
    }

    getData(employeeId) {
        let basePage = new BasePage();
        let employee = basePage.GetUserLogged();
        let preselectedFilter = "Other";
        if (employee.department !== undefined && employee.department !== null) {
            if (ENV().preselectedFilter[employee.department.name] !== undefined && ENV().preselectedFilter[employee.department.name] !== null) {
                preselectedFilter = ENV().preselectedFilter[employee.department.name];
            }
        }

        this.userData.GetEmployeeSkills(employeeId, true).then(data => {
            let preselectedId = null;
            data.forEach(function(val) {
                if (val.type === "tool" && val.name === preselectedFilter) preselectedId = val.id;
            });

            this.setState({
                data: data,
                preselectedFilter: preselectedFilter,
                selectedGroup: preselectedId
            });
        }).catch(data => {
          
            console.log("user data error", data);
          
        });
    }

    componentDidMount() {
        let employeeId = this.props.userId;
        this.getData(employeeId);
    }

	componentWillReceiveProps(nextProps) {
        let employeeId = nextProps.skill.userId;
        this.getData(employeeId);
	}

    render() {
    	return (
    		<div className="my-profile-add-skills-table">
    			<div className="header-bar col -col-12 -col-no-gutter">
    				<div className="col -col-3"><span className="table-header">Filter</span></div>
    				<div className="col -col-5 col-name"><span className="table-header">Name</span></div>
    				<div className="col -col-3"><span className="table-header">Category</span></div>
    				<div className="col -col-1"><span className="table-header">Skills</span></div>
    			</div>
    			<AddSkillsFilter data={this.state.data} onSelectedGroup={this.handleFilter.bind(this)} selected={this.state.preselectedFilter} />
    			<AddSkillsList data={this.state.data} selectedGroup={this.state.selectedGroup} />
    		</div>
    	);
    }
}