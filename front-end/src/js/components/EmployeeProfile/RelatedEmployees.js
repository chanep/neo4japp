import React from "react";

import { Link } from "react-router";
import RelatedEmployee from './RelatedEmployee';
import UserServices from '../../services/UserServices';

export default class RelatedEmployees extends React.Component {

    constructor() {
        super();

        this.state = {
            similarSkilledUsers: [],
            relatedUsers: {
                "areaCoordinator": {
                    id: 0,
                    section: "",
                    name: "",
                    position: "",
                    department: "",
                    image: "",
                    email: ""
                },
                "resourceManager": {
                    id: 1420,
                    section: "Resource Management",
                    name: "Agostina Gomez",
                    position: "Associate Resource Manager",
                    department: "Resource Management",
                    image: "/img/img_noPortrait.gif",
                    email: ""
                },
                "similarSkilledUser": {
                    id: 0,
                    section: "",
                    name: "",
                    position: "",
                    department: "",
                    image: "",
                    email: ""
                }  
            }
        };

        this.getRelatedUsers = this.getRelatedUsers.bind(this);
        this.getUser = this.getUser.bind(this);
    }

    getRelatedUsers(userId) {
        var userService = new UserServices();

        userService.GetSimilarSkilledUsers(userId).then(users =>{




            // Mock data
            // TO REMOVE WHEN USERS HAVE SKILLS POPULATED
            // -------------------------------------------
            /*users = [{
                id: 4839, 
                fullname: "Test 1", 
                email: "test.1@rga.com", 
                username: "test1", 
                image: "http://x.com/pic.jpg",
                position: { id: 4835, name: "Software Engineer" }, 
                office: { id: 4832, name: "Buenos Aires", country: "Argentina", acronym: "BA" }, 
                department: { id: 4834, name: "Technology" }, 
                similitudeScore: 38
            }, {
                id: 5000, 
                fullname: "Test 2", 
                email: "test.2@rga.com", 
                username: "test2", 
                image: "http://x.com/pic.jpg",
                position: { id: 4835, name: "Visual Designer" }, 
                office: { id: 4832, name: "Buenos Aires", country: "Argentina", acronym: "BA" }, 
                department: { id: 4834, name: "Creative" }, 
                similitudeScore: 38
            }];*/
            // ---------------------------------------------







            var similarSkilledUsers = [];

            users.forEach(function (user) {
                similarSkilledUsers.push({
                    "section": "People with similar skills",
                    "id": user.id,
                    "name": user.fullname,
                    "position": user.position.name,
                    "department": user.department.name,
                    "image": user.image,
                    "email": user.email
                });
            });


            this.setState({ "similarSkilledUsers": similarSkilledUsers });

            // Populate the relatedUsers object with the first similar skilled user

            var relatedUsers = this.state.relatedUsers;
            relatedUsers.similarSkilledUser = similarSkilledUsers[0];

            this.setState({ relatedUsers: relatedUsers });
        }).catch(data => {
            console.log("user data error", data);
        });
    }

    getUser(userId) {
        var userService = new UserServices(),
            relatedUsers = this.state.relatedUsers;

        if (userId > 0) {
            userService.GetUserData(userId).then(data => {

                if (data.approvers[0] != undefined) {
                    var approver = data.approvers[0];

                    relatedUsers.areaCoordinator = {
                        "id": approver.id,
                        "section": "Area Coordination",
                        "name": approver.fullname,
                        "position": approver.position.name,
                        "department": approver.department.name,
                        "image": approver.image,
                        "email": approver.email
                    };
                } else {
                    relatedUsers.areaCoordinator = {
                        "id": 0,
                        "section": "0",
                        "name": "",
                        "position": "",
                        "department": "",
                        "image": "",
                        "email": ""
                    };
                }

                this.setState({ relatedUsers: relatedUsers });

                console.log(data);
            }).catch(data => {
              
                console.log("user data error", data);
              
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        this.getRelatedUsers(nextProps.userId);
        this.getUser(nextProps.userId);
    }

    render() {
        let areaCoordinator = this.state.relatedUsers.areaCoordinator;
        let resourceManager = this.state.relatedUsers.resourceManager;
        let similarSkilledUser = this.state.relatedUsers.similarSkilledUser;

        var multiple = false;

        if (this.state.similarSkilledUsers.length > 1)
            multiple = true;

    	return (
    		<div className="employee-related-employees">
                {this.state.relatedUsers.areaCoordinator.id != 0 ?
                    <RelatedEmployee user={areaCoordinator} />
                : false }
                <RelatedEmployee user={resourceManager} />
                {this.state.similarSkilledUsers.length > 0 ?
                    <RelatedEmployee user={similarSkilledUser} similar="true" multiple={multiple} similarSkilledUsers={this.state.similarSkilledUsers} />
    		    : false}
            </div>
    	);
    }

}