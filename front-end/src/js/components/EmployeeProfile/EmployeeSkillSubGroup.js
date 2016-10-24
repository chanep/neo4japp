/**
 * Components: EmployeeSkillSubGroup
 */

// Dependencies
import React from 'react';
import { Link } from 'react-router'
import EmployeeSkill from "./EmployeeSkill";
import ApproverEmployeeSkill from "./ApproverEmployeeSkill";

export default class EmployeeSkillSubGroup extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        	showLevels: false,
        	data: props.subGroupData,
            approverMode: (props.approverMode !== undefined?props.approverMode:false)
        };
    }

    componentWillReceiveProps(nextProps) {
    	this.setState({
    		showLevels: false,
    		data: nextProps.subGroupData,
            approverMode: (nextProps.approverMode !== undefined? nextProps.approverMode:false)
    	});
    }

    showHideLevels() {
        if(this.state.showLevels) {
            this.setState({ showLevels: false });
        } else {
            this.setState({ showLevels: true });
        }
    }

    onSkillApproved(id) {
        if (this.props.onSkillApproved !== undefined)
            this.props.onSkillApproved(id);
    }

    render() {
        let self = this;
        let skillsCount = this.state.data.skills.length;
        let pendings = 0;
        this.state.data.skills.forEach(function(skill) {
            if (skill.knowledge !== null && skill.knowledge.approved === undefined) pendings++;
        });

        return (
            <div className="zebra-table">
                <div className="grid">
                    <div className="col -col-10">
                        <p className="table-row-heading">{this.state.data.name}</p>
                    </div>
                    <div className="col -col-1">
                        <span className="table-row">{skillsCount}{pendings > 0?<i className="validate-pending" title={pendings + " pending approval"}></i>:null}</span>
                    </div>
                    <div className={this.state.showLevels ? "col -col-1 results-arrow-open-close skill-opened" : "col -col-1 results-arrow-open-close"} onClick={this.showHideLevels.bind(this)}>
                        <i className="ss-icon-down-arrow"></i>
                    </div>
                </div>
                { this.state.showLevels ? 
                    <div className="skill-level-grid">
                        <div className="skill-level-grid__header col -col-12 -col-no-gutter">
                            <div className="col -col-2">
                                <span className="sub-table-header"></span>
                            </div>
                            <div className="col -col-1">
                                <span className="sub-table-header">{this.state.approverMode?"Verified?":"Want?"}</span>
                            </div>
                            <div className="col -col-2">
                                <span className="sub-table-header">Heavy Supervision</span>
                            </div>
                            <div className="col -col-2">
                                <span className="sub-table-header">Light Supervision</span>
                            </div>
                            <div className="col -col-2">
                                <span className="sub-table-header">No Supervision</span>
                            </div>
                            <div className="col -col-2">
                                <span className="sub-table-header">Teach/Manage</span>
                            </div>
                            <div className="col -col-1 skill-level-empty">
                                <span className="sub-table-header"></span>
                            </div>
                        </div>
                        {
                            this.state.data.skills.map(function(skill, key) {
                                return(
                                        self.state.approverMode?
                                          <ApproverEmployeeSkill skill={skill} key={key} onSkillApproved={self.onSkillApproved.bind(self)} />
                                        : <EmployeeSkill skill={skill} key={key} />
                                );
                            })
                        }
                    </div>
                 : null }
            </div>
        );
    }
}