import React from 'react';
import ENV from '../../../config.js';
import { Router, Route, Link } from 'react-router'
import SkillLevel from './SkillLevel'

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
                    <span>{this.state.obj.obj.name}</span>
                </div>
                <div className="proficiency">
                    <span>{this.state.obj.obj.level}. {ENV().knowledgeLevels[this.state.obj.obj.level-1].desc}</span>
                </div>
                <SkillLevel level={this.state.obj.obj.level} />
            </li>
		);
	}
}