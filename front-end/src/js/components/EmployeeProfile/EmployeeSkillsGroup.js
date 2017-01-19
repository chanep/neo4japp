/**
 * Components: EmployeeSkillsGroup
 */

// Dependencies
import React from 'react';
import { Link } from 'react-router'
import EmployeeSkillSubGroup from "./EmployeeSkillSubGroup";

export default class EmployeeSkillsGroup extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        	data: props.groupData,
        	approverMode: (props.approverMode !== undefined? props.approverMode:false)
        };
    }

    componentWillReceiveProps(nextProps) {
    	this.setState({
    		data: nextProps.groupData,
    		approverMode: (nextProps.approverMode !== undefined? nextProps.approverMode:false)
    	});
    }

    onSkillApproved(id) {
        if (this.props.onSkillApproved !== undefined)
            this.props.onSkillApproved(id);
    }

    render() {
    	let self = this;
    	return(
    		<div>
		        <div className="header-bar">
		            <div className="group-skills-title col col-12">
		                <span className="table-header">{this.state.data.name}</span>
		            </div>
		        </div>
		        <div className="results-section">
                    <div className="skill-level-grid">
                        <div className="skill-level-grid__header">
                            <div className="col -col-3 -col-no-gutter">
                                <span className="sub-table-header"></span>
                            </div>
                            <div className="col -col-1 -col-no-gutter skill-employee-header">
                                <span className="sub-table-header">Want?</span>
                            </div>
                            <div className="col -col-2 -col-no-gutter skill-employee-header">
                                <span className="sub-table-header">Heavy Supervision</span>
                            </div>
                            <div className="col -col-2 -col-no-gutter skill-employee-header">
                                <span className="sub-table-header">Light Supervision</span>
                            </div>
                            <div className="col -col-2 -col-no-gutter skill-employee-header">
                                <span className="sub-table-header">No Supervision</span>
                            </div>
                            <div className="col -col-2 -col-no-gutter skill-employee-header">
                                <span className="sub-table-header">Teach/Manage</span>
                            </div>
                        </div>
                    </div>
	            	{
	            		this.state.data.children.map(function(obj, key) {
	            			return (
	            				<EmployeeSkillSubGroup subGroupData={obj} key={key} approverMode={self.state.approverMode} onSkillApproved={self.onSkillApproved.bind(self)} />
	            			);
	            		})
					
	            	}
	            </div>
		    </div>
    	);
    }
}