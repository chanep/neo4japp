/**
 * Components: MyTeemEmployee
 */

// Dependencies
import React from 'react';
import { Link } from 'react-router';

// Class: MyTeemEmployee
export default class MyTeemEmployee extends React.Component {
    constructor() {
        super();

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
        if (this.state.employee === null)
            return <div />

        let skillsCount = 0;
        let skillsPendingValidation = this.state.employee.totalPendingApproval;
        
        this.state.employee.skillGroups.forEach(function(skillGroup) {
            skillGroup.skills.forEach(function(skill) {
                skillsCount++;
            });
        });

        return(
            <Link to={"/employee/" + this.state.employee.id + "/verification"} >
                <div className="grid zebra-table lined-table manager-home-employee">
                    <div className="col -col-7 title">
                        <div className="name">{this.state.employee.fullname}</div>
                        <div className="position">{this.state.employee.position.name}</div>
                    </div>
                    <div className="col -col-2">
                        <span className="table-row location">{this.state.employee.office.acronym}</span>
                    </div>
                    <div className="col -col-2">
                        <span className="skills_hidden" style={{'display': 'none'}}>{skillsCount}</span>
                        <span className="table-row">{skillsCount} {skillsPendingValidation > 0? <i className="validate-pending" title={skillsPendingValidation + " pending skills for validation"}></i>: null}</span>
                    </div>
                    <div className="col -col-1 -col-arrow">
                        <i className="ss-icon-right-arrow right-small-arrow"></i>
                    </div>
                </div>
            </Link>
        );
    }
}