/**
 * Components: AddSkill
 */

// Dependencies
import React from 'react';
import { Link } from 'react-router';

export default class AddSkill extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        	skill: null
        };
    }

    componentDidMount() {
    	this.setState({
    		skill: this.props.skill
    	});
    }

	componentWillReceiveProps(nextProps) {
		this.setState({
			skill: nextProps.skill
		});
	}

    render() {
        if (this.state.skill === null)
            return <div />

        return (
            <div className="skill-level-grid__levels col -col-12 -col-no-gutter">
                <div className="col -col-2 overflowHidden">
                    <span className="table-header" title={this.state.skill.name}>{this.state.skill.name}</span>
                </div>
                <div className="col -col-1 skill-level-want-wrapper">
                    <span className="skill-title">
                        <input type="checkbox" label="skill-want" />
                    </span>
                </div>
                <div className="col -col-2 skill-level-box selectable">
                    <span className="skill-title"></span>
                </div>
                <div className="col -col-2 skill-level-box selectable">
                    <span className="skill-title"></span>
                </div>
                <div className="col -col-2 skill-level-box selectable">
                    <span className="skill-title"></span>
                </div>
                <div className="col -col-2 skill-level-box selectable">
                    <span className="skill-title"></span>
                </div>
                <div className="col -col-1">
                    <span className="skill-title"></span>
                </div>
            </div>
        );
    }
}