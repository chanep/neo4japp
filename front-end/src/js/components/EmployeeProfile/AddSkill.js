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
            self.setState({
                skill: update(
                    self.state.skill, {knowledge: {$set: data}}
                )
            });

            self.showAlert();
        }).catch(err => {

        });
    }

    removeKnowledge() {
        let self = this;

        if (this.state.skill.knowledge !== null)
            return;
        
        self.setState({
            skill: update(
                self.state.skill, {knowledge: {$set: null}}
            )
        });
    }

    render() {
        if (this.state.skill === null)
            return <div />

        let checked = (this.state.skill.knowledge !== null && this.state.skill.knowledge.want);

        var opts = {};
        if (this.state.skill.knowledge !== null) {
            opts['readOnly'] = 'readOnly';
        }

        return (
            <div className="skill-level-grid__levels col -col-12 -col-no-gutter">
                <div className="col -col-2 overflowHidden">
                    <span className="sub-table-header" title={this.state.skill.name}>{this.state.skill.name}</span>
                </div>
                <div className="col -col-1 skill-level-want-wrapper">
                    <span className="skill-title">
                        <input className={this.state.skill.knowledge === null?"selectable":"readOnly"} type="checkbox" label="skill-want" checked={checked} onChange={this.levelChanged.bind(this, true, null)} {...opts} />
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
                <div className={"col -col-1 " + (this.state.skill.knowledge !== null?"remove-skill": "")}>
                    {this.state.skill.knowledge !== null?<span className="ss-icon-close" title="Remove skill" onClick={this.removeKnowledge.bind(this)}><span className="path1"></span><span className="path2"></span></span>: null}
                </div>
            </div>
        );
    }
}