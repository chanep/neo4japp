/**
 * Components: AddSkillsFilter
 */

// Dependencies
import React from 'react';
import { Link } from 'react-router';

export default class AddSkillsFilter extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        	data: []
        };
    }

    componentDidMount() {
    	this.setState({data: this.props.data});
    }

	componentWillReceiveProps(nextProps) {
		this.setState({data: nextProps.data});
	}

  	onValueChanged(refVal, e) {
		this.props.onSelectedGroup(refVal);
  	}

    render() {
    	console.log("this.state.data", this.state.data);
    	let skills = [];
    	let tools = [];

    	this.state.data.forEach(function(val) {
    		if (val.type == "skill") skills.push(val);
    		else tools.push(val);
    	});

    	let self = this;

    	return(
    		<div className="addSkillsFilter filters col -col-3">
    			<div className="filterType">
					<span className="filter-title">Skills</span>
					<ul>
						{
							skills.map(function(obj, key) {
								let countPerSkill = 0;
								obj.children.forEach(function(child) {
									countPerSkill += child.skills.length;
								});

								return (
									<li className="filter-option" key={key}>
										<label><input type="radio" name="skillstools" onChange={self.onValueChanged.bind(self, obj.id)} /> {obj.name} ({countPerSkill})</label>
									</li>
								)
							})
						}
					</ul>
				</div>
    			<div className="filterType">
					<span className="filter-title">Tools</span>
					<ul>
						{
							tools.map(function(obj, key) {
								let countPerSkill = 0;
								obj.children.forEach(function(child) {
									countPerSkill += child.skills.length;
								});

								return (
									<li className="filter-option" key={key}>
										<label><input type="radio" name="skillstools" onChange={self.onValueChanged.bind(self, obj.id)} /> {obj.name} ({countPerSkill})</label>
									</li>
								)
							})
						}
					</ul>
				</div>
    		</div>
    	);
    }
}