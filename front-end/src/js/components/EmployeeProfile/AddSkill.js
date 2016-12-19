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
        	skill: null,
            groupLength: 0
        };



        this.userServices = new UserServices();
    }

    componentDidMount() {
    	this.setState({
    		skill: this.props.skill,
            groupLength: this.props.groupLength
    	});
    }

	componentWillReceiveProps(nextProps) {
		this.setState({
			skill: nextProps.skill,
            groupLength: nextProps.groupLength
		});
	}

    showAlert(messg){
        msg.show(messg, {
            time: 3500,
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

            self.showAlert('Skill added');
        }).catch(err => {
            console.log("Error adding skill", err);
        });
    }

    removeKnowledge() {
        let self = this;

        if (this.state.skill.knowledge === null)
            return;
        
        this.userServices.DeleteKnowledge(this.state.skill.id).then(data => {
            self.setState({
                skill: update(
                    self.state.skill, {knowledge: {$set: null}}
                )
            });

            self.showAlert('Skill removed');
        }).catch(err => {
            console.log("Error removing skill", err);
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
            <div className="add-row col -col-12 -col-no-gutter">
                <div className="row-levels">
                    <div className="col -col-2 overflowHidden -col-no-gutter -col-skill-name" title={this.state.skill.name}>
                        {this.state.skill.name}
                    </div>
                    <div className="col -col-1 skill-level-want-wrapper -col-no-gutter">
                        <span className="skill-title">
                            <input className={this.state.skill.knowledge === null?"selectable":"readOnly"} type="checkbox" label="skill-want" checked={checked} onChange={this.levelChanged.bind(this, true, null)} {...opts} />
                        </span>
                    </div>
                    <div className={"col -col-2 -col-no-gutter skill-level-box " + (this.state.skill.knowledge === null? "selectable" : (this.state.skill.knowledge.level === 1? (this.state.skill.knowledge.approved === undefined? "level-non-verified": "level-verified") : ""))}
                        onClick={this.levelChanged.bind(this, false, 1)}>
                        <span className="skill-title">&nbsp;</span>
                    </div>
                    <div className={"col -col-2 -col-no-gutter skill-level-box " + (this.state.skill.knowledge === null? "selectable" : (this.state.skill.knowledge.level === 2? (this.state.skill.knowledge.approved === undefined? "level-non-verified": "level-verified") : ""))}
                        onClick={this.levelChanged.bind(this, false, 2)}>
                        <span className="skill-title">&nbsp;</span>
                    </div>
                    <div className={"col -col-2 -col-no-gutter skill-level-box " + (this.state.skill.knowledge === null? "selectable" : (this.state.skill.knowledge.level === 3? (this.state.skill.knowledge.approved === undefined? "level-non-verified": "level-verified") : ""))}
                        onClick={this.levelChanged.bind(this, false, 3)}>
                        <span className="skill-title">&nbsp;</span>
                    </div>
                    <div className={"col -col-2 -col-no-gutter skill-level-box " + (this.state.skill.knowledge === null? "selectable" : (this.state.skill.knowledge.level === 4? (this.state.skill.knowledge.approved === undefined? "level-non-verified": "level-verified") : ""))}
                        onClick={this.levelChanged.bind(this, false, 4)}>
                        <span className="skill-title">&nbsp;</span>
                    </div>
                    <div className={"col -col-1 -col-no-gutter " + (this.state.skill.knowledge !== null?"remove-skill": "")}>
                        {this.state.skill.knowledge !== null?<span className="ss-icon-close" title="Remove skill" onClick={this.removeKnowledge.bind(this)}><span className="path1"></span><span className="path2"></span></span>: null}
                    </div>
                </div>
                {
                    this.state.groupLength === 1 && this.state.skill.description !== undefined?
                    <div className="skill-description">
                        {this.state.skill.description}
                    </div>
                    :null
                }
            </div>
        );
    }
}