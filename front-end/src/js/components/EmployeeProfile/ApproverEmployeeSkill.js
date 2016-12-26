/**
 * Components: ApproverEmployeeSkill
 */

// Dependencies
import React from 'react';
import { Link } from 'react-router';
import UserServices from '../../services/UserServices';
import AlertContainer from 'react-alert';
import update from 'react-addons-update';
import ReactTooltip from 'react-tooltip'

export default class ApproverEmployeeSkill extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: props.skill,
            indent: props.indent
        };

        this.userServices = new UserServices();
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            data: nextProps.skill,
            indent: nextProps.indent
        });
    }

    getChild (obj,key){
        let result = Object.keys(obj).map(function(k) { return obj[key]});
        return result[0];
    }

    showAlert(messg){
        msg.show(messg, {
            time: 3500,
            type: 'success',
            icon: <img src="/img/success-ico.png" />
        });
    }

    makeid()
    {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < 15; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    changeState(level) {
        let self = this;

        if (this.state.data.knowledge === null)
            return;
        if (this.getChild(this.state.data.knowledge, "want"))
            return;

        let approved = (this.getChild(this.state.data.knowledge, "approved") !== undefined && this.getChild(this.state.data.knowledge, "approved") === true);

        if (approved) {
            this.userServices.DisapproveKnowledge(this.state.data.knowledge.id).then(data => {
                self.setState({
                    data: update(
                        self.state.data, {knowledge: {$set: data}}
                    )
                });

                self.showAlert('Skill knowledge unverified');
            }).catch(err => {
                console.log("Error disapproving skill knowledge", err);
            });
        }
        else {
            this.userServices.ApproveKnowledge(this.state.data.knowledge.id).then(data => {
                self.setState({
                    data: update(
                        self.state.data, {knowledge: {$set: data}}
                    )
                });

                self.showAlert('Skill knowledge verified');

                if (this.props.onSkillApproved !== undefined)
                    this.props.onSkillApproved(self.state.data.id);
            }).catch(err => {
                console.log("Error approving skill knowledge", err);
            });
        }
    }

    render() {
        let verified = (this.getChild(this.state.data.knowledge, "approved") !== undefined && this.getChild(this.state.data.knowledge, "approved") === true);
        let approver = "";
        let want = (this.state.data.knowledge !== null && this.getChild(this.state.data.knowledge, "want"));
        if (verified) {
            approver = this.getChild(this.state.data.knowledge, "approverFullname");
        }

        var opts = {};
        opts['readOnly'] = 'readOnly';

        let newId = "tooltip_" + this.makeid();

        return (
            <div className="skill-level-grid__levels">
                <div className="col -col-3">
                    <span className={"sub-table-header " + (this.state.indent?"with-indent": "")}>{this.state.data.name}</span>
                </div>
                <div className="col -col-1 skill-level-want-wrapper">
                    <span className="skill-title">
                        <input className="readOnly" type="checkbox" label="skill-want" checked={want} {...opts} />
                    </span>
                </div>
                <div title={this.state.data.knowledge.level === 1 && verified?"Approved by " + approver: "Verification pending"} onClick={this.changeState.bind(this, 1)} className={"col -col-2 " + (this.state.data.knowledge.level === 1? "skill-level-box skill-level-changeable " + (verified? "level-verified": "level-non-verified"): "")}>
                    {this.state.data.knowledge.level === 1?
                        (want?<span>&nbsp;</span>:
                            (!verified? <span className="skill-title">Verify</span>:
                                        <div><span className="icon-unverify">x</span> <span className="skill-title">Unverify</span></div>)
                        ):<span>&nbsp;</span>
                    }
                </div>
                <div title={this.state.data.knowledge.level === 2 && verified?"Approved by " + approver: "Verification pending"} onClick={this.changeState.bind(this, 2)} className={"col -col-2 " + (this.state.data.knowledge.level === 2? "skill-level-box skill-level-changeable " + (verified? "level-verified": "level-non-verified"): "")}>
                    {this.state.data.knowledge.level === 2?
                        (want?<span>&nbsp;</span>:
                            (!verified? <span className="skill-title">Verify</span>:
                                        <div><span className="icon-unverify">x</span> <span className="skill-title">Unverify</span></div>)
                        ):<span>&nbsp;</span>
                    }
                </div>
                <div title={this.state.data.knowledge.level === 3 && verified?"Approved by " + approver: "Verification pending"} onClick={this.changeState.bind(this, 3)} className={"col -col-2 " + (this.state.data.knowledge.level === 3? "skill-level-box skill-level-changeable " + (verified? "level-verified": "level-non-verified"): "")}>
                    {this.state.data.knowledge.level === 3?
                        (want?<span>&nbsp;</span>:
                            (!verified? <span className="skill-title">Verify</span>:
                                        <div><span className="icon-unverify">x</span> <span className="skill-title">Unverify</span></div>)
                        ):<span>&nbsp;</span>
                    }
                </div>
                <div title={this.state.data.knowledge.level === 4 && verified?"Approved by " + approver: "Verification pending"} onClick={this.changeState.bind(this, 4)} className={"col -col-2 " + (this.state.data.knowledge.level === 4? "skill-level-box skill-level-changeable " + (verified? "level-verified": "level-non-verified"): "")}>
                    {this.state.data.knowledge.level === 4?
                        (want?<span>&nbsp;</span>:
                            (!verified? <span className="skill-title">Verify</span>:
                                        <div><span className="icon-unverify">x</span> <span className="skill-title">Unverify</span></div>)
                        ):<span>&nbsp;</span>
                    }
                </div>
            </div>
        )
    }
}