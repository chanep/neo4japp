import React from "react";

import { Link } from "react-router";
import UserServices from '../../services/UserServices';

export default class EmployeeHeader extends React.Component {

    constructor(){
        super();
       
        this.state = {
            user: [],
            skillsCount: 0,
            addSkills: true
        }

        this.userData = new UserServices();
    }

    getChild (obj,key){
        if (this.isReady) {
            let result = Object.keys(obj).map(function(k) { return obj[key]});
            return result[0];
        }
    }

    getUser(userId) {
        let userIdFinal = userId;
        if (userId == 0) userIdFinal = null;

        this.userData.GetUserData(userIdFinal).then(data => {
            let skillsCount = 0;
            data.skillGroups.forEach(obj => {
                skillsCount += obj.skills.length;
            });

            this.setState({
                user: data,
                skillsCount: skillsCount
            });
        }).catch(data => {
          
            console.log("user data error", data);
          
        });
    }

    componentWillReceiveProps(nextProps) {
        this.getUser(nextProps.userId);
        this.setState({addSkills: nextProps.addSkills})
    }

    componentDidMount() {
        this.getUser(this.props.userId);
        this.setState({addSkills: this.props.addSkills})
    }

    render () {
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
        				<div className="employee-subtitle">
                        {
                            this.getChild(this.state.user.position, 'name')
                        }
                        </div>
                       
        				<div className="employee-subtitle"><span className="subtitle-annotation">Manager: </span>Mauro Gonzalez</div>

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

                        
                        {this.state.addSkills?
                            <div className="employee-skills-add">
                                <Link to="/myprofile/myskills">ADD NEW SKILLS</Link>
                            </div>
                            :
                            <div className="employee-skills-add">
                                <Link to="/myprofile">VIEW YOUR SKILLS</Link>
                            </div>
                        }
                        {/*
                        <div className="employee-skills-add employee-skills-verify">
                            <span className="icon-alert">!</span>
                            <a href="#">VERIFY 3 SKILLS IN TOTAL</a>
                        </div>
                        *}
                        {/* Verify skills label */}
        				<div className="employee-skills-last-update">
        					Last Updated <span>05/04/2016</span>
        				</div>
        			</div>
        		</div>
        	</div>
        );
    }
}