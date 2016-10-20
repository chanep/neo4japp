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
            showForManagerVerification: false
        }

        this.userData = new UserServices();
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

    render () {
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

        				<div className="employee-interests">
        					<div className="interest"><span className="ss-icon-heart"></span> Photography, Drones, Airplanes, Football</div>
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
                                        <Link to="/myprofile/myskills">ADD NEW SKILLS</Link>
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