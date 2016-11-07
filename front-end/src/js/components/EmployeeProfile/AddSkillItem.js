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
    	if (this.state.data === null && this.state.parent === null)
    		return <div />

        return (
            <div className="row-add-skill">
                <div className="grid">
                    <div className="col -col-5 -col-name overflowHidden" title={this.state.data.name}>{this.state.data.name}</div>
                    <div className="col -col-4 overflowHidden" title={this.state.parent.name}>{this.state.parent.name}</div>
                    <div className="col -col-2">{this.state.data.skills.length}</div>
                    <div className={this.state.open ? "col -col-1 results-arrow-open-close skill-opened" : "col -col-1 results-arrow-open-close"} onClick={this.openClose.bind(this)}><i className="ss-icon-down-arrow"></i></div>
                </div>
                { this.state.open ? 
					<div className="skill-level-grid">
                        <div className="skill-level-grid__header col -col-12 -col-no-gutter">
                            <div className="col -col-2">
                                <span className="sub-table-header">Skill</span>
                            </div>
                            <div className="col -col-1">
                                <span className="sub-table-header">Want?</span>
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
                                <span className="table-header"></span>
                            </div>
                        </div>
                        {
                            this.state.data.skills.map(function(skill, key) {
                                return(
                                    <AddSkill skill={skill} key={key} />
                                );
                            })
                        }
                    </div>
                 : null }
            </div>
        )
    }
}