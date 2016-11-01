import React from 'react';
import { Router, Route, Link } from 'react-router'

export default class SkillLevel extends React.Component {
	constructor(level) {
		super();

		this.state = {
			level: level.level,
			approved: level.appoved
		}
	}

	componentDidMount() {
		this.setState({
			level: this.props.level,
			approved: this.props.approved
		});
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			level: nextProps.level,
			approved: nextProps.approved
		});
	}

	render() {
		if (this.state.level === null || this.state.level === undefined)
			return null;
		
		return (
			<div className="skill-bar">
                <div className={"bar " + (this.state.approved? "": "notApproved")}></div>
                {this.state.level >= 2 ? <div className={"bar " + (this.state.approved? "": "notApproved")}></div>:""}
                {this.state.level >= 3 ? <div className={"bar " + (this.state.approved? "": "notApproved")}></div>:""}
                {this.state.level >= 4 ? <div className={"bar " + (this.state.approved? "": "notApproved")}></div>:""}
            </div>
		);
	}
}