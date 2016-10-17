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
                    section: "Area Coordination",
                    name: "Leopoldo Simini",
                    position: "Executive Technology Director",
                    department: "Technology",
                    image: "http://x.com/pic.jpg"
                },
                "resourceManager": {
                    section: "Resource Management",
                    name: "Agostina Gomez",
                    position: "Associate Resource Manager",
                    department: "Resource Management",
                    image: "http://x.com/pic.jpg"
                },
                "similarSkilledUsers": {
                    section: "",
                    name: "",
                    position: "",
                    department: "",
                    image: ""
                }
            } // TO POPULATE WITH REAL DATA
        };

        this.getRelatedUsers = this.getRelatedUsers.bind(this);
    }

    getRelatedUsers(userId) {
        var userService = new UserServices();

        userService.GetSimilarSkilledUsers(userId).then(users =>{




            // Mock data
            // TO REMOVE WHEN USERS HAVE SKILLS POPULATED
            // -------------------------------------------
            users = [{
                id: 4839, 
                fullname: "Pepe Test4", 
                email: "pepe.test4@rga.com", 
                username: "pepetest4", 
                image: "http://x.com/pic.jpg",
                position: { id: 4835, name: "Developer" }, 
                office: { id: 4832, name: "Buenos Aires", country: "Argentina", acronym: "BA" }, 
                department: { id: 4834, name: "Technology" }, 
                similitudeScore: 38
            }, {
                id: 5000, 
                fullname: "JEJEJ", 
                email: "pepe.test4@rga.com", 
                username: "pepetest4", 
                image: "http://x.com/pic.jpg",
                position: { id: 4835, name: "DEV" }, 
                office: { id: 4832, name: "Buenos Aires", country: "Argentina", acronym: "BA" }, 
                department: { id: 4834, name: "TECH" }, 
                similitudeScore: 38
            }];
            // ---------------------------------------------







            var similarSkilledUsers = [];

            users.forEach(function (user) {
                similarSkilledUsers.push({
                    section: "People with similar skills",
                    name: user.fullname,
                    position: user.position.name,
                    department: user.department.name,
                    image: user.image
                });
            });


            this.setState({ "similarSkilledUsers": similarSkilledUsers });

            // Populate the relatedUsers object with the first similar skilled user

            var relatedUsers = this.state.relatedUsers;
            relatedUsers.similarSkilledUsers = similarSkilledUsers[0];

            this.setState({ relatedUsers: relatedUsers });
        });
    }

    componentWillReceiveProps(nextProps) {
        this.getRelatedUsers(nextProps.userId);
    }

    render() {
        let areaCoordinator = this.state.relatedUsers.areaCoordinator;
        let resourceManager = this.state.relatedUsers.resourceManager;
        let similarSkilledUser = this.state.relatedUsers.similarSkilledUsers;

    	return (
    		<div className="employee-related-employees">
                <RelatedEmployee section={areaCoordinator.section} image={areaCoordinator.image} name={areaCoordinator.name} position={areaCoordinator.position} department={areaCoordinator.department} />
                <RelatedEmployee section={resourceManager.section} image={resourceManager.image} name={resourceManager.name} position={resourceManager.position} department={resourceManager.department} />
                <RelatedEmployee section={similarSkilledUser.section} image={similarSkilledUser.image} name={similarSkilledUser.name} position={similarSkilledUser.position} department={similarSkilledUser.department} />
    		</div>
    	);
    }

}