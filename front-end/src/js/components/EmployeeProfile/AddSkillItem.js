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

        let employeeHasThisCategory = 0;
        this.state.data.skills.forEach(function(skill, index) {
            if (skill.knowledge !== null) employeeHasThisCategory++;
        });

        return (
            <div className="row-add-skill">
                <div className="grid add-row-div" onClick={this.openClose.bind(this)}>
                    <div className="col -col-6 -col-name overflowHidden" title={this.state.data.name}>
                        {this.state.data.name}
                    </div>
                    <div className="col -col-4 overflowHidden" title={this.state.parent.name}>{this.state.parent.name}</div>
                    <div className="col -col-1">
                        {this.state.data.skills.length}
                        {employeeHasThisCategory >0? <i className="employee-Has-Category" title={"You have " + employeeHasThisCategory + " skill(s)/tool(s) from this category"}></i> : null}
                    </div>
                    <div className={this.state.open ? "col -col-1 results-arrow-open-close skill-opened" : "col -col-1 results-arrow-open-close"}><i className="ss-icon-down-arrow"></i></div>
                </div>
                { this.state.open ? 
					<div className="skill-level-grid skill-level-grid-add">
                        <div className="skill-level-grid__header col -col-12 -col-no-gutter">
                            <div className="col -col-2 -col-no-gutter">
                                <span className="sub-table-header">Skill</span>
                            </div>
                            <div className="col -col-1 -col-no-gutter">
                                <span className="sub-table-header">Want?</span>
                            </div>
                            <div className="col -col-2 -header-heavy-supervision -col-no-gutter">
                                <span className="sub-table-header">Heavy Supervision</span>
                            </div>
                            <div className="col -col-2 -col-no-gutter">
                                <span className="sub-table-header">Light Supervision</span>
                            </div>
                            <div className="col -col-2 -col-no-gutter">
                                <span className="sub-table-header">No Supervision</span>
                            </div>
                            <div className="col -col-2 -col-no-gutter">
                                <span className="sub-table-header">Teach/Manage</span>
                            </div>
                            <div className="col -col-1 skill-level-empty -col-no-gutter">
                                <span className="table-header"></span>
                            </div>
                        </div>
                        {
                            this.state.data.skills.map(function(skill, key) {
                                return(
                                    <AddSkill skill={skill} key={key} groupLength={self.state.data.skills.length} />
                                );
                            })
                        }
                    </div>
                 : null }
            </div>
        )
    }
}