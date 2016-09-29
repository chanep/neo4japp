import React from 'react';
import { Router, Route, Link } from 'react-router'

export default class SkillResult extends React.Component {
	constructor(obj, key) {
		super();

		this.state = {
			obj: obj,
			key: key
		};
	}

	render() {
		return (
            <li className="col -col-4">
                <div className="title">
                    <span>Angular</span>
                </div>
                <div className="proficiency">
                    <span>4. Can teach / manage others</span>
                </div>
                <div className="skill-bar">
                    <div className="bar"></div>
                    <div className="bar"></div>
                    <div className="bar"></div>
                    <div className="bar"></div>
                </div>
            </li>
		);
	}
}