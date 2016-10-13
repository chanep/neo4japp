/**
 * Components: EmployeeAddSkillsTable
 */

// Dependencies
import React from 'react';
import { Link } from 'react-router';
import AddSkillsFilter from './AddSkillsFilter';
import UserServices from '../../services/UserServices';
import AddSkillsList from './AddSkillsList';

export default class EmployeeAddSkillsTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        	data: [],
        	selectedGroup: 0
        };

        this.userData = new UserServices();
    }

    handleFilter(selectedValue) {
    	this.setState({selectedGroup: selectedValue});
    }

    getData() {
        this.userData.GetEmployeeSkills(true).then(data => {
            this.setState({
                data: data
            });
        }).catch(data => {
          
            console.log("user data error", data);
          
        });
    }

    componentDidMount() {
    	this.getData();
    }

	componentWillReceiveProps(nextProps) {

	}

    render() {
    	return (
    		<div className="my-profile-add-skills-table">
    			<div className="header-bar col -col-12 -col-no-gutter">
    				<div className="col -col-3"><span className="table-header">Filter</span></div>
    				<div className="col -col-3"><span className="table-header">Name</span></div>
    				<div className="col -col-3"><span className="table-header">Category</span></div>
    				<div className="col -col-3"><span className="table-header">Skills</span></div>
    			</div>
    			<AddSkillsFilter data={this.state.data} onSelectedGroup={this.handleFilter.bind(this)} />
    			<AddSkillsList selectedGroup={this.state.selectedGroup} />
    		</div>
    	);
    }
}