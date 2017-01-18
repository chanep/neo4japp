/**
 * Components: AddSkill
 */

// Dependencies
import React from 'react';
import { Link } from 'react-router';
import update from 'react-addons-update';
import UserServices from '../../services/UserServices';
import AlertContainer from 'react-alert';
import ReactTooltip from 'react-tooltip'

export default class AddSkill extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        	skill: null,
            groupLength: 0,
            skillWant: false,
            skillLevel: null,
            levelsOpen: false
        };

        this.userServices = new UserServices();
    }

    componentDidMount() {
    	this.setState({
    		skill: this.props.skill,
            groupLength: this.props.groupLength
    	});

        if (this.props.groupLength === 1) { this.setState({ "levelsOpen": true })}
    }

	componentWillReceiveProps(nextProps) {
		this.setState({
			skill: nextProps.skill,
            groupLength: nextProps.groupLength,
		});

        if (nextProps.groupLength === 1) { this.setState({ "levelsOpen": true })}
	}

    showAlert(messg){
        msg.show(messg, {
            time: 3500,
            type: 'success',
            icon: <img src="/img/success-ico.png" />
        });
    }

    toggleWant() {
        var want = !this.state.skillWant,
            level = null;

        this.setState({ 'skillLevel': level, 'skillWant': want });

        this.levelChanged(level, want);
    }

    changeLevel(level) {
        let self = this;

        if (level == this.state.skillLevel) {
            level = null;
        } else {
            if (this.state.skill.knowledge !== null) {
                if (level == this.state.skill.knowledge.level) {
                    level = null;
                }
            }
        }

        this.setState({ 'skillWant': false, 'skillLevel': level });

        if (this.state.skill.knowledge === null) {
            this.levelChanged(level, this.state.skillWant);
        } else {
            this.userServices.DeleteKnowledge(this.state.skill.id).then(data => {
                self.setState({
                    skill: update(
                        self.state.skill, {knowledge: {$set: null}}
                    )
                });

                if (level != null) {
                    self.levelChanged(this.state.skillLevel, self.state.skillWant);
                }
            }).catch(err => {
                console.log("Error removing skill", err);
            });
        }
    }

    levelChanged(level, want) {
        let self = this;

        this.userServices.SetKnowledge(this.state.skill.id, level, want).then(data => {
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

    openLevels() {
        let levelsOpen = this.state.levelsOpen;

        this.setState({ levelsOpen: !levelsOpen });
    }

    makeid()
    {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < 15; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    render() {
        if (this.state.skill === null)
            return <div />

        let checked = (this.state.skill.knowledge !== null && this.state.skill.knowledge.want);

        var opts = {};
        if (this.state.skill.knowledge !== null) {
            opts['readOnly'] = 'readOnly';
        }

        let newId = "tooltip_" + this.makeid();

        return (
            <div>
                {
                    this.state.groupLength > 1 ?
                        <div className="add-row col -col-12 -col-no-gutter" onClick={this.openLevels.bind(this)}>
                            <div className="col -col-11 -col-name overflowHidden skill-name sub-skill-name" title={this.state.skill.name}>
                                {this.state.skill.name}
                            </div>
                            <div className={this.state.levelsOpen ? "col -col-1 sub-results-arrow-open-close skill-opened" : "col -col-1 sub-results-arrow-open-close"}><i className="ss-icon-down-arrow"></i></div>
                            {
                                this.state.groupLength === 1 && this.state.skill.description !== undefined && this.state.skill.description !== "" ?
                                <div className="skill-description">
                                    {this.state.skill.description}
                                </div>
                                :null
                            }
                        </div>
                        : false
                }
                <div className="add-row col -col-12 -col-no-gutter">
                    {
                        this.state.groupLength === 1 && this.state.skill.description !== undefined && this.state.skill.description !== "" ?
                        <div className="skill-description">
                            {this.state.skill.description}
                        </div>
                        :null
                    }
                    { this.state.levelsOpen ?
                    <div className="row-levels">
                        <div className={"col -col-3 -col-no-gutter add-skill-box skill-level-box selectable " + (checked ? "level-verified" : "")}
                            onClick={this.toggleWant.bind(this)}>
                            <span className="skill-title">Want</span>
                        </div>
                        <div className={"col -col-2 -col-no-gutter add-skill-box skill-level-box selectable " + (this.state.skill.knowledge === null ? "" : (this.state.skill.knowledge.level === 1 ? (this.state.skill.knowledge.approved === undefined? "level-non-verified": "level-verified") : ""))}
                            onClick={this.changeLevel.bind(this, 1)}>
                            <span className="skill-title">Heavy Supervision</span>
                        </div>
                        <div className={"col -col-2 -col-no-gutter add-skill-box skill-level-box selectable " + (this.state.skill.knowledge === null ? "" : (this.state.skill.knowledge.level === 2 ? (this.state.skill.knowledge.approved === undefined? "level-non-verified": "level-verified") : ""))}
                            onClick={this.changeLevel.bind(this, 2)}>
                            <span className="skill-title">Light Supervision</span>
                        </div>
                        <div className={"col -col-2 -col-no-gutter add-skill-box skill-level-box selectable " + (this.state.skill.knowledge === null ? "" : (this.state.skill.knowledge.level === 3 ? (this.state.skill.knowledge.approved === undefined? "level-non-verified": "level-verified") : ""))}
                            onClick={this.changeLevel.bind(this, 3)}>
                            <span className="skill-title">No Supervision</span>
                        </div>
                        <div className={"col -col-2 -col-no-gutter add-skill-box skill-level-box selectable " + (this.state.skill.knowledge === null ? "" : (this.state.skill.knowledge.level === 4 ? (this.state.skill.knowledge.approved === undefined? "level-non-verified": "level-verified") : ""))}
                            onClick={this.changeLevel.bind(this, 4)}>
                            <span className="skill-title">Teach/Manage</span>
                        </div>
                    </div>
                    : false }
                </div>
            </div>
        );
    }
}