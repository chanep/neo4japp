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

    render() {
    	let self = this;
    	return(
    		<div>
		        <div className="header-bar col -col-12 -col-no-gutter">
		            <div className="col -col-12">
		                <span className="table-header">{this.state.data.name}</span>
		            </div>
		        </div>
		        <div className="results-section">
		            <div className="results-profile results results--right col -col-12 -col-no-gutter">
		            	{
		            		this.state.data.children.map(function(obj, key) {
		            			return (
		            				<EmployeeSkillSubGroup subGroupData={obj} key={key} approverMode={self.state.approverMode} />
		            			);
		            		})
						
		            	}
		            </div>
		        </div>
		    </div>
    	);
    }
}