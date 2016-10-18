/**
 * Components: MyTeemEmployee
 */

// Dependencies
import React from 'react';

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
        let skillsPendingValidation = 0;

        this.state.employee.skillGroups.forEach(function(skillGroup) {
            skillGroup.skills.forEach(function(skill) {
                skillsCount++;
                if (skill.knowledge.approved === undefined) {
                    skillsPendingValidation++;
                }
            });
        })

        return(
            <div className="grid">
                <div className="col -col-8">
                    <p className="table-row-heading">{this.state.employee.fullname}</p>
                    <p className="table-row-small">{this.state.employee.position.name}</p>
                </div>
                <div className="col -col-2">
                    <span className="table-row">{this.state.employee.office.acronym}</span>
                </div>
                <div className="col -col-2">
                    <span className="table-row">{skillsCount} {skillsPendingValidation > 0? <i className="validate-pending" title={skillsPendingValidation + " pending skills for validation"}></i>: null}</span>
                </div>
                <div className="col -col-1">
                    <i className="ss-icon-right-arrow right-small-arrow"></i>
                </div>
            </div>
        );
    }
}