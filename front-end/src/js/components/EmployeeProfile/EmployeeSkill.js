/**
 * Components: EmployeeSkill
 */

// Dependencies
import React from 'react';
import { Link } from 'react-router'

export default class EmployeeSkill extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        	data: props.skill
        };
    }

    componentWillReceiveProps(nextProps) {
    	this.setState({
    		data: nextProps.skill
    	});
    }

    getChild (obj,key){
        let result = Object.keys(obj).map(function(k) { return obj[key]});
        return result[0];
    }

    render() {
        let verified = false;
        let approver = "";
        if (this.getChild(this.state.data.knowledge, "approved") !== undefined) {
            verified = true;
            approver = this.getChild(this.state.data.knowledge, "approverFullname");
        }

    	return (
            <div className="skill-level-grid__levels col -col-12 -col-no-gutter">
                <div className="col -col-2">
                    <span className="sub-table-header">{this.state.data.name}</span>
                </div>
                <div className="col -col-1 skill-level-want-wrapper">
                    <span className="skill-title">
                        <input type="checkbox" label="skill-want" readOnly checked={this.state.data.knowledge.want} />
                    </span>
                </div>
                <div title={verified?"Approved by " + approver: "Verification pending"} className={"col -col-2 " + (this.state.data.knowledge.level >= 1? "skill-level-box " + (verified? "level-verified": "level-non-verified"): "")}>
                    <span className="skill-title"></span>
                </div>
                <div title={verified?"Approved by " + approver: "Verification pending"} className={"col -col-2 " + (this.state.data.knowledge.level >= 2? "skill-level-box " + (verified? "level-verified": "level-non-verified"): "")}>
                    <span className="skill-title"></span>
                </div>
                <div title={verified?"Approved by " + approver: "Verification pending"} className={"col -col-2 " + (this.state.data.knowledge.level >= 3? "skill-level-box " + (verified? "level-verified": "level-non-verified"): "")}>
                    <span className="skill-title"></span>
                </div>
                <div title={verified?"Approved by " + approver: "Verification pending"} className={"col -col-2 " + (this.state.data.knowledge.level >= 4? "skill-level-box " + (verified? "level-verified": "level-non-verified"): "")}>
                    <span className="skill-title"></span>
                </div>
                <div className="col -col-1">
                    <span className="skill-title"></span>
                </div>
            </div>
    	)
    }
}