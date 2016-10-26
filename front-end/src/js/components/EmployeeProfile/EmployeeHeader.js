import React from "react";

import { Link } from "react-router";
import UserServices from '../../services/UserServices';

export default class EmployeeHeader extends React.Component {

    constructor(){
        super();
       
        this.state = {
            user: null,
            skillsCount: 0,
            addSkills: true,
            showActions: false,
            showForManagerVerification: false,
            editingInterests: false
        }

        this.userData = new UserServices();

        this.editInterests = this.editInterests.bind(this);
        this.handleInterestChange = this.handleInterestChange.bind(this);
        this.removeInterest = this.removeInterest.bind(this);
    }

    getChild (obj,key){
        let result = Object.keys(obj).map(function(k) { return obj[key]});
        return result[0];
    }

    getUser(userId) {        
        if (userId > 0) {
            this.userData.GetUserData(userId).then(data => {
                this.setState({
                    user: data,
                    skillsCount: data.skillCount,
                    unapprovedSkillCount: data.unapprovedSkillCount
                });
            }).catch(data => {
              
                console.log("user data error", data);
              
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        this.getUser(nextProps.userId);
        this.setState({
            addSkills: nextProps.addSkills,
            showActions: nextProps.showActions,
            showForManagerVerification: nextProps.showForManagerVerification
        })
    }

    componentDidMount() {
        this.getUser(this.props.userId);
        this.setState({
            addSkills: this.props.addSkills,
            showActions: this.props.showActions,
            showForManagerVerification: this.props.showForManagerVerification
        })
    }

    editInterests() {
        this.setState({ editingInterests: true });
    }

    finishInterestsEdition() {
        this.setState({ editingInterests: false });
    }

    handleInterestChange() {
        console.log('test');
    }

    removeInterest(interestId) {
        this.userData.RemoveInterest(interestId).then(data => {
            console.log('Interest removed successfully');
        }).catch(data => {
            console.log('Error while removing interest', data);
        });
    }

    render () {
        var self = this;

        if (this.state.user === null)
            return <div />
        
        let position = this.state.user.position.name;
        return (
        	<div className="employee-header-container">
        		<div className="grid">
        			<div className="col -col-1">
                        {(this.state.user.image ?
                            <img src={this.state.user.image} className="profilePic"></img>
                            : <img src="/img/img_noPortrait.gif" className="profilePic"></img>
                        )}
        			</div>
        			<div className="col -col-9">
        				<div className="employee-name">{this.state.user.fullname}</div>
        				<div className="employee-subtitle">{position}</div>
                       
                        <div className="employee-subtitle"><span className="subtitle-annotation">Manager: </span>{this.getChild(this.state.user, "approvers").length > 0?this.getChild(this.state.user, "approvers")[0].fullname:"----"}</div>

                        {this.state.editingInterests ?
                            <div className="modal">
                                <div className="modal-header" onClick={this.finishInterestsEdition.bind(this)}>
                                    <span className="modal-close ss-icon-close"><span className="path1"></span><span className="path2"></span></span>
                                </div>
                                <div className="modal-contents">
                                    <h2>Edit interests</h2>
                                    <form>
                                        <input id="interest" type="text" placeholder="Interest" className="inputTextBox" onChange={this.handleInterestChange.bind(this)} />
                                        <input type="submit" className="add-interest" value="Add interest" />
                                    </form>
                                    <ul className="interests">
                                    {this.state.user.interests.map((interest, index)=>{
                                      return (<li className="interest" key={index}><span className="remove-interest ss-icon-remove" data-interest-id={interest.id} onClick={self.removeInterest.bind(interest.id)}></span> {interest.name}</li>)
                                    })}
                                    </ul>
                                </div>
                            </div>
                        : false }

        				<div className="employee-interests">
        					<div className="interest editable-interest" onClick={this.editInterests.bind(this)}><span className="ss-icon-heart"></span> Photography, Drones, Airplanes, Football <span className="edit ss-icon-pencil"></span></div>
        					<div className="interest"><span className="ss-icon-industry"></span> Finance, Marketing, Public Sector</div>
        					<div className="interest"><span className="ss-icon-clients"></span> Nike, PwC, Samsung, Loreal</div>
        				</div>
        			</div>
        			<div className="col -col-2">
        				<div className="employee-skills-counter">
        					<div className="count">{this.state.skillsCount}</div>
        					<div className="label">Total Skills</div>
        				</div>

                        {
                            this.state.showActions?
                                this.state.addSkills?
                                    <div className="employee-skills-add">
                                        <Link to="/myprofile/myskills">ADD / REMOVE SKILLS</Link>
                                    </div>
                                    :
                                    <div className="employee-skills-add">
                                        <Link to="/myprofile">VIEW YOUR SKILLS</Link>
                                    </div>
                            : null
                        }
                        {this.state.showForManagerVerification?
                            <div className="employee-skills-add employee-skills-verify">
                                <span className="icon-alert">!</span>
                                <span className="label">VERIFY {this.state.unapprovedSkillCount} SKILLS IN TOTAL</span>
                            </div>
                        : null}
        				<div className="employee-skills-last-update">
        					Last Updated <span>05/04/2016</span>
        				</div>
        			</div>
        		</div>
        	</div>
        );
    }
}