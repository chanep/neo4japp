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
            open: false,
        	clicksCount: 0
        };
    }

    componentDidMount() {
    	this.setState({
    		data: this.props.data,
    		parent: this.props.parent,
    		clicksCount: 0
    	});
    }

	componentWillReceiveProps(nextProps) {
		this.setState({
			data: nextProps.data,
			parent: nextProps.parent,
            open: false,
			clicksCount: 0
		});
	}

    openClose() {
        let isOpen = this.state.open;
        this.setState({
            open: !isOpen
        });
    }

	didClick() {
        let clicksCount = this.state.clicksCount + 1;

        if (clicksCount > 2)
            clicksCount = 0;

        if (clicksCount === 2 && (
                this.state.data.skills.length < 2 &&
                this.state.data.name !== this.state.data.skills[0].name
            ) && (this.state.data.skills[0].description === undefined || this.state.data.skills[0].description === ""))
            clicksCount = 0;

        if ((this.state.data.skills.length > 1 || (this.state.data.skills.length === 1 && this.state.data.name !== this.state.data.skills[0].name)) && clicksCount === 2)
            clicksCount = 0;

        this.setState({clicksCount: clicksCount});
	}

    render() {
        let self = this;

    	if (this.state.data === null && this.state.parent === null)
    		return <div />

        let employeeHasThisCategory = 0,
            approvedCategory = false;

        this.state.data.skills.forEach(function(skill, index) {
            if (skill.knowledge !== null) {
                if (skill.knowledge.level !== undefined || skill.knowledge.want) {
                    employeeHasThisCategory++;

                    if (skill.knowledge.approved || skill.knowledge.want) {
                        approvedCategory = true;
                    }
                } else {
                    if (skill.knowledge.want) {
                        approvedCategory = true;
                    }
                }
            }
        });

        let showSubset = this.state.data.skills.length > 1 || (this.state.data.skills.length === 1 && this.state.data.name !== this.state.data.skills[0].name);
        return (
            <div className="row-add-skill">
                    <div className={"grid add-row-div " + (this.state.open ? "add-row-div-open" : false )} onClick={this.openClose.bind(this)}>                    <div className="col -col-11 -col-name overflowHidden skill-name" title={this.state.data.name}>
                        {employeeHasThisCategory > 0 ? <i className={approvedCategory ? "employee-Has-Category" : "validate-pending add-skill-validate-pending"} title={"You have " + employeeHasThisCategory + " skill(s)/tool(s) from this category"}></i> : false}
                        {
                            showSubset
                                ? <span className="skill-name-label skill-name-label--light">{this.state.data.name} ({this.state.data.skills.length})</span>
                                : <span className="skill-name-label">{this.state.data.name}</span>
                        }
                    </div>
                    {
                        showSubset ?
                        <div className="col -col-1 results-arrow-open-close">
                            {this.state.open
                                ? <i className="ss-icon-minus"></i>
                                : <i className="ss-icon-plus"></i>
                            }
                        </div>
                        : false
                    }
                </div>
                { this.state.open ? 
                    <div className="skill-level-grid skill-level-grid-add">
                    {
                        this.state.data.skills.map(function(skill, key) {
                            return(
                                <AddSkill skill={skill} key={key} groupLength={self.state.data.skills.length} showSubset={showSubset} />
                            );
                        })
                    }
                    </div>
                 : null }
            </div>
        )
    }
}