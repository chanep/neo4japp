/**
 * Components: EmployeeSkillSubGroup
 */

// Dependencies
import React from 'react';
import { Link } from 'react-router'
import SkillsLevelTable from "../SkillsLevelTable";

export default class EmployeeSkillSubGroup extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        	showLevels: false,
        	data: props.subGroupData
        };
    }

    componentWillReceiveProps(nextProps) {
    	this.setState({
    		showLevels: false,
    		data: nextProps.subGroupData
    	});
    }

    showHideLevels() {
        if(this.state.showLevels) {
            this.setState({ showLevels: false });
        } else {
            this.setState({ showLevels: true });
        }
    }

    render() {
        return (
            <div>
                <div className="grid">
                    <div className="col -col-10">
                        <p className="table-row-heading">{this.state.data.name}</p>
                    </div>
                    <div className="col -col-1">
                        <span className="table-row">5<i className="validate-pending"></i></span>
                    </div>
                    <div className={this.state.showLevels ? "col -col-1 results-arrow-open-close skill-opened" : "col -col-1 results-arrow-open-close"} onClick={this.showHideLevels.bind(this)}>
                        <i className="ss-icon-down-arrow"></i>
                    </div>
                </div>
                { this.state.showLevels ? <SkillsLevelTable /> : null }
            </div>
        );
    }
}