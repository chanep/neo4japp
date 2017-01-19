/**
 * Components: AddSkillItem
 */

// Dependencies
import React from 'react';
import { Link } from 'react-router';
import AddSkill from './AddSkill';

export default class AddSkillItem extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        	data: null,
        	parent: null,
        	clicksCount: 0
        };
    }

    componentDidMount() {
    	this.setState({
    		data: this.props.data,
    		parent: this.props.parent,
    		clicksCount: 0
    	});
    }

	componentWillReceiveProps(nextProps) {
		this.setState({
			data: nextProps.data,
			parent: nextProps.parent,
			clicksCount: 0
		});
	}

	didClick() {
        let clicksCount = this.state.clicksCount + 1;

        if (clicksCount > 2)
            clicksCount = 0;

        if (clicksCount === 2 && this.state.data.skills.length < 2 && (this.state.data.skills[0].description === undefined || this.state.data.skills[0].description === ""))
            clicksCount = 0;

        if (this.state.data.skills.length > 1 && clicksCount === 2)
            clicksCount = 0;

        this.setState({clicksCount: clicksCount});
	}

    render() {
        let self = this;

    	if (this.state.data === null && this.state.parent === null)
    		return <div />

        let employeeHasThisCategory = 0,
            approvedCategory = false;

        this.state.data.skills.forEach(function(skill, index) {
            if (skill.knowledge !== null && skill.knowledge.level !== undefined) {
                employeeHasThisCategory++;

                if (skill.knowledge.approved) {
                    approvedCategory = true;
                }
            }
        });

        return (
            <div className="row-add-skill">
                <div className={"grid add-row-div " + (this.state.clicksCount > 0 ? "add-row-div-open" : false )} onClick={this.didClick.bind(this)}>
                    <div className="col -col-11 -col-name overflowHidden skill-name" title={this.state.data.name}>
                        {employeeHasThisCategory > 0 ? <i className={approvedCategory ? "employee-Has-Category" : "validate-pending add-skill-validate-pending"} title={"You have " + employeeHasThisCategory + " skill(s)/tool(s) from this category"}></i> : false}
                        {
                            this.state.data.skills.length > 1
                                ? <span className="skill-name-label skill-name-label--light">{this.state.data.name} ({this.state.data.skills.length})</span>
                                : <span className="skill-name-label">{this.state.data.name}</span>
                        }
                    </div>
                    {
                        this.state.data.skills.length > 1 ?
                        <div className="col -col-1 results-arrow-open-close">
                            {this.state.clicksCount > 0
                                ? <i className="ss-icon-minus"></i>
                                : <i className="ss-icon-plus"></i>
                            }
                        </div>
                        :
                        <div className={"col -col-1 results-arrow-open-close " + (this.state.clicksCount > 0? "skill-opened" : "")}>
                            {this.state.clicksCount > 0
                                ? <i className="ss-icon-down-arrow"></i>
                                : <i className="ss-icon-down-arrow"></i>
                            }
                        </div>
                    }
                </div>
                { this.state.clicksCount > 0 ?
    				<div className="skill-level-grid skill-level-grid-add">
                        {this.state.data.skills.map(function(skill, key) {
                            return(
                                <AddSkill skill={skill} key={key} groupLength={self.state.data.skills.length} clicksCount={self.state.clicksCount} />
                            );
                        })}
                    </div>
                 : null }
            </div>
        )
    }
}