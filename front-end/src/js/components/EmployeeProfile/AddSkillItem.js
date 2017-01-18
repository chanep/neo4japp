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
        	open: false
        };
    }

    componentDidMount() {
    	this.setState({
    		data: this.props.data,
    		parent: this.props.parent,
    		open: false
    	});
    }

	componentWillReceiveProps(nextProps) {
		console.log("nextProps", nextProps);
		this.setState({
			data: nextProps.data,
			parent: nextProps.parent,
			open: false
		});
	}

	openClose() {
		let isOpen = this.state.open;
		this.setState({
			open: !isOpen
		});
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
                <div className={"grid add-row-div " + (this.state.open ? "add-row-div-open" : false )} onClick={this.openClose.bind(this)}>
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
                            {this.state.open
                                ? <i className="ss-icon-minus"></i>
                                : <i className="ss-icon-plus"></i>
                            }
                        </div>
                        : false
                    }
                </div>
                { this.state.open ? 
					<div className="skill-level-grid skill-level-grid-add">
                        {
                            this.state.data.skills.map(function(skill, key) {
                                return(
                                    <AddSkill skill={skill} key={key} groupLength={self.state.data.skills.length}  />
                                );
                            })
                        }
                    </div>
                 : null }
            </div>
        )
    }
}