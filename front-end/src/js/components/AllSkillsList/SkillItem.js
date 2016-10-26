/**
 * Components: SkillItem
 */

// Dependencies
import React from 'react';
import { Link } from 'react-router';

export default class SkillItem extends React.Component {
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
		let showLevels = this.state.showLevels;
		this.setState({
			showLevels: !showLevels
		});
	}

    render() {
    	if (this.state.data === null && this.state.parent === null)
    		return <div />

        return (
            <div>
                <div className="grid">
                    <div className="col -col-5">
                        <p className="table-row-heading">{this.state.data.name}</p>
                    </div>
                    <div className="col -col-4">
                        <p className="table-row">{this.state.parent.name}</p>
                    </div>
                    <div className="col -col-2">
                        <span className="table-row">{this.state.data.skills.length}</span>
                    </div>
                    <div className={this.state.showLevels ? "col -col-1 results-arrow-open-close skill-opened" : "col -col-1 results-arrow-open-close"} onClick={this.openClose.bind(this)}>
                        <i className="ss-icon-down-arrow"></i>
                    </div>
                </div>
                { this.state.showLevels ? 
                    <div className="skill-level-grid">
                        {this.state.data.skills.map((skill, key) =>
                            <div className="skill-level-grid__levels col -col-12 -col-no-gutter" key={key}>
                                <Link to={"/searchresults/" + skill.id}>
                                    <div className="col -col-12">
                                        <span className="table-header">{skill.name}</span>
                                    </div>
                                </Link>
                            </div>
                        )}
                    </div>
                : null }
            </div>
        )
    }
}