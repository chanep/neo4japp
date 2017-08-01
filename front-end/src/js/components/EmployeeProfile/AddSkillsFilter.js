/**
 * Components: AddSkillsFilter
 */

// Dependencies
import React from 'react';
import { Link } from 'react-router';
import BasePage from '../../pages/BasePage';
import {gaAddSkillsFilter} from '../../services/GoogleAnalytics';

export default class AddSkillsFilter extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        	data: [],
        	idSelected: null
        };
        this.basePage = new BasePage();
    }

    componentDidMount() {
    	let propSelected = this.props.selected !== undefined?this.props.selected:null;
    	this.setState({
    		data: this.props.data,
    		preselectedFilter: propSelected
    	});
    }

	componentWillReceiveProps(nextProps) {
		let propSelected = nextProps.selected !== undefined ? nextProps.selected : null;
		this.setState({
			data: nextProps.data,
			preselectedFilter: propSelected
		});
	}

  onValueChanged(refVal, newText, e) {
    gaAddSkillsFilter(newText, this.basePage.GetCurrentUserType());
    
		this.setState({
			idSelected: refVal
		});
		this.props.onSelectedGroup(refVal, newText);
  }

    render() {
    	let skills = [];
    	let tools = [];

    	this.state.data.forEach(function(val) {
    		if (val.type == "skill") skills.push(val);
    		else tools.push(val);
    	});

    	let self = this;

    	return(
    		<div className="addSkillsFilter filters col -col-3 filters__backgrounded">
    			<div className="filterType">
					<span className="filter-title">Skills</span>
					<ul>
						{
							skills.map(function(obj, key) {
								let countPerSkill = 0;
								obj.children.forEach(function(child) {
									countPerSkill += child.skills.length;
								});

								let checked = false;
								if (self.state.idSelected !== null)
									checked = (self.state.idSelected === obj.id);
								else
									checked = (self.state.preselectedFilter === obj.name);

								return (
									<li className="filter-option" key={key}>
										<label className="filter-option-clickel"><input type="radio" name="skillstools" checked={checked} onChange={self.onValueChanged.bind(self, obj.id, obj.name)} /> {obj.name} ({countPerSkill})</label>
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

								let checked = false;
								if (self.state.idSelected !== null)
									checked = (self.state.idSelected === obj.id);
								else
									checked = (self.state.preselectedFilter === obj.name);

								return (
									<li className="filter-option" key={key}>
										<label className="addskill-filter-clickel"><input type="radio" name="skillstools" checked={checked} onChange={self.onValueChanged.bind(self, obj.id, obj.name)} /> {obj.name} ({countPerSkill})</label>
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