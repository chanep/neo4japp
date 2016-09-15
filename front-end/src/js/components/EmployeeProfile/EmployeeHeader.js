import React from "react";

import { Link } from "react-router";
import UserServices from '../../services/UserServices';

export default class EmployeeHeader extends React.Component {

    constructor(){
        super();
       
        this.state = {}

        this.getUser();
    }
    

    getUser(e) {
        let self = this;
        let userData = new UserServices();
        return userData.GetUserData().then(data => {

            this.setState(data);
            
        }).catch(data => {
          
            console.log("user data error", data);
          
        });

      }


    render () {
        


        return (
           
        	<div className="employee-header-container">
        		<div className="grid">
        			<div className="col -col-1">
						<img src="img/profile-pic.png" />
        			</div>
        			<div className="col -col-9">
        				<div className="employee-name">{this.state.fullname}</div>
        				<div className="employee-subtitle">
                        
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
        					<div className="count">10</div>
        					<div className="label">Total Skills</div>
        				</div>
                        {/* Add new skills label */}
        				{/*
                            <div className="employee-skills-add">
                                <a href="#">ADD NEW SKILLS</a>
                            </div>
                        */}
                        {/* Verify skills label */}
                        <div className="employee-skills-add employee-skills-verify">
                            <span className="icon-alert">!</span>
                            <a href="#">VERIFY 3 SKILLS IN TOTAL</a>
                        </div>
        				<div className="employee-skills-last-update">
        					Last Updated <span>05/04/2016</span>
        				</div>
        			</div>
        		</div>
        	</div>
        );
    }
}