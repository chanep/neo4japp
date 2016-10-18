/**
 * Components: AddSkill
 */

// Dependencies
import React from 'react';
import { Link } from 'react-router';
import update from 'react-addons-update';
import UserServices from '../../services/UserServices';
import AlertContainer from 'react-alert';

export default class AddSkill extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        	skill: null
        };



        this.userServices = new UserServices();
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

    showAlert(){
        msg.show('Skill added', {
            time: 10000,
            type: 'success',
            icon: <img src="/img/success-ico.png" />
        });
    }

    levelChanged(arg1, arg2) {
        let self = this;

        if (this.state.skill.knowledge !== null)
            return;

        this.userServices.SetKnowledge(this.state.skill.id, arg2, arg1).then(data => {
            this.setState({
                skill: update(
                    this.state.skill, {knowledge: {$set: data}}
                )
            });

            self.showAlert();
        }).catch(err => {

        });
    }

    render() {
        if (this.state.skill === null)
            return <div />

        let readOnly = (this.state.skill.knowledge !== null);
        let checked = (this.state.skill.knowledge !== null && this.state.skill.knowledge.want);

        return (
            <div className="skill-level-grid__levels col -col-12 -col-no-gutter">
                <div className="col -col-2 overflowHidden">
                    <span className="sub-table-header" title={this.state.skill.name}>{this.state.skill.name}</span>
                </div>
                <div className="col -col-1 skill-level-want-wrapper">
                    <span className="skill-title">
                        <input type="checkbox" label="skill-want" readOnly={readOnly} defaultChecked={checked} onClick={this.levelChanged.bind(this, true, null)} />
                    </span>
                </div>
                <div className={"col -col-2 skill-level-box " + (this.state.skill.knowledge === null? "selectable" : (this.state.skill.knowledge.level === 1? "level-selected" : ""))}
                    onClick={this.levelChanged.bind(this, false, 1)}>
                    <span className="skill-title"></span>
                </div>
                <div className={"col -col-2 skill-level-box " + (this.state.skill.knowledge === null? "selectable" : (this.state.skill.knowledge.level === 2? "level-selected" : ""))}
                    onClick={this.levelChanged.bind(this, false, 2)}>
                    <span className="skill-title"></span>
                </div>
                <div className={"col -col-2 skill-level-box " + (this.state.skill.knowledge === null? "selectable" : (this.state.skill.knowledge.level === 3? "level-selected" : ""))}
                    onClick={this.levelChanged.bind(this, false, 3)}>
                    <span className="skill-title"></span>
                </div>
                <div className={"col -col-2 skill-level-box " + (this.state.skill.knowledge === null? "selectable" : (this.state.skill.knowledge.level === 4? "level-selected" : ""))}
                    onClick={this.levelChanged.bind(this, false, 4)}>
                    <span className="skill-title"></span>
                </div>
                <div className="col -col-1">
                    <span className="skill-title"></span>
                </div>
            </div>
        );
    }
}