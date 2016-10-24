/**
 * Components: ApproverEmployeeSkill
 */

// Dependencies
import React from 'react';
import { Link } from 'react-router';
import UserServices from '../../services/UserServices';
import AlertContainer from 'react-alert';
import update from 'react-addons-update';

export default class ApproverEmployeeSkill extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: props.skill
        };

        this.userServices = new UserServices();
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            data: nextProps.skill
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

    approve() {
        let self = this;

        if (this.state.data.knowledge === null)
            return;
        
        this.userServices.ApproveKnowledge(this.state.data.knowledge.id).then(data => {
            console.log("data confirmacion", data);
            self.setState({
                data: update(
                    self.state.skill, {knowledge: {$set: data}}
                )
            });

            showAlert('Skill knowledge approve');
        }).catch(err => {
            console.log("Error approving skill knowledge", err);
        });
    }

    render() {
        let verified = false;
        let approver = "";
        if (this.state.data.knowledge !== null && this.getChild(this.state.data.knowledge, "approved") !== undefined) {
            verified = true;
            approver = this.getChild(this.state.data.knowledge, "approverFullname");
        }

        var opts = {};
        if (verified) {
            opts['readOnly'] = 'readOnly';
        }

        return (
            <div className="skill-level-grid__levels col -col-12 -col-no-gutter">
                <div className="col -col-2">
                    <span className="sub-table-header">{this.state.data.name}</span>
                </div>
                <div className="col -col-1 skill-level-want-wrapper">
                    <span className="skill-title">
                        <input className={!verified?"selectable":"readOnly"} type="checkbox" label="skill-want" checked={verified} onChange={this.approve.bind(this)} {...opts} />
                    </span>
                </div>
                <div title={verified?"Approved by " + approver: "Verification pending"} className={"col -col-2 " + (this.state.data.knowledge.level >= 1? "skill-level-box " + (verified? "level-verified": "level-non-verified"): "")}>
                    <span className="skill-title"></span>
                </div>
                <div title={verified?"Approved by " + approver: "Verification pending"} className={"col -col-2 " + (this.state.data.knowledge.level >= 2? "skill-level-box " + (verified? "level-verified": "level-non-verified"): "")}>
                    <span className="skill-title"></span>
                </div>
                <div title={verified?"Approved by " + approver: "Verification pending"} className={"col -col-2 " + (this.state.data.knowledge.level >= 3? "skill-level-box " + (verified? "level-verified": "level-non-verified"): "")}>
                    <span className="skill-title"></span>
                </div>
                <div title={verified?"Approved by " + approver: "Verification pending"} className={"col -col-2 " + (this.state.data.knowledge.level >= 4? "skill-level-box " + (verified? "level-verified": "level-non-verified"): "")}>
                    <span className="skill-title"></span>
                </div>
                <div className="col -col-1">
                    <span className="skill-title"></span>
                </div>
            </div>
        )
    }
}