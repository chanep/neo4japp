/**
 * Components: EmployeeSkillSubGroup
 */

// Dependencies
import React from 'react';
import { Link } from 'react-router'
import EmployeeSkill from "./EmployeeSkill";
import ApproverEmployeeSkill from "./ApproverEmployeeSkill";
import {gaVerifyViewSkill} from "../../services/GoogleAnalytics";

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

    onSkillApproved(id) {
        if (this.props.onSkillApproved !== undefined){
            gaVerifyViewSkill();
            this.props.onSkillApproved(id);
        }
    }

    render() {
        let self = this;
        let skillsCount = this.state.data.skills.length;
        let pendings = 0;
        this.state.data.skills.forEach(function(skill) {
            if (skill.knowledge !== null && skill.knowledge.approved === undefined && !skill.knowledge.want) pendings++;
        });

        let multipleInside = this.state.data.skills.length > 1;

        return (
            <div className="zebra-table">
                {multipleInside?
                    <div className="grid">
                        <div className="col -col-12 subgroup-title-name">
                            <p className="table-row-heading skill-subgroup-title">{this.state.data.name}</p>
                        </div>
                    </div>
                    : null
                }
                <div>
                    {
                        this.state.data.skills.map(function(skill, key) {
                            return(
                                    <div className="skill-level-grid" key={key}>
                                        {self.state.approverMode?
                                            <ApproverEmployeeSkill skill={skill} indent={multipleInside} onSkillApproved={self.onSkillApproved.bind(self)} />
                                            : <EmployeeSkill skill={skill} indent={multipleInside} />
                                        }
                                    </div>
                            );
                        })
                    }
                </div>
            </div>
        );
    }
}