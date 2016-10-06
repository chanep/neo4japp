import React from 'react';
import { Router, Route, Link } from 'react-router'

export default class SkillLevel extends React.Component {
	constructor(level) {
		super();

		this.state = {
			level: level.level
		}
	}

	componentWillReceiveProps(nextProps) {
		this.setState({level: nextProps.level});
	}

	render() {
		return (
			<div className="skill-bar">
                <div className="bar"></div>
                {this.state.level >= 2 ? <div className="bar"></div>:""}
                {this.state.level >= 3 ? <div className="bar"></div>:""}
                {this.state.level >= 4 ? <div className="bar"></div>:""}
            </div>
		);
	}
}