import React from "react";

import { Link } from "react-router";
import RelatedEmployee from './RelatedEmployee';
import UserServices from '../../services/UserServices';
import BasePage from '../../pages/BasePage';

export default class RelatedEmployees extends React.Component {

    constructor() {
        super();

        this.state = {
            similarSkilledUsers: [],
            currentSimilarSkilledUser: null,  
            areaCoordinator: null,
            resourceManager: null
        };
    }

    getRelatedUsers(userId) {
        var userService = new UserServices();

        userService.GetSimilarSkilledUsers(userId).then(users =>{
            var similarSkilledUsers = [];

            users.forEach(function (user) {
                if (user !== null) {
                    similarSkilledUsers.push({
                        "section": "People with similar skills",
                        "id": user.id,
                        "name": user.fullname,
                        "position": user.position !== null ? user.position.name : "",
                        "department": user.department !== null ? user.department.name : "",
                        "image": user.image,
                        "email": user.email
                    });
                }
            });

            this.setState({
                "similarSkilledUsers": similarSkilledUsers,
                "currentSimilarSkilledUser": (similarSkilledUsers.length > 0 ? similarSkilledUsers[0] : null)
            });
        }).catch(data => {
            console.log("user data error", data);
        });
    }

    getUser(userId) {
        var userService = new UserServices();
        let areaCoordinator = { };
        let resourceManager = { };

        if (userId > 0) {
            userService.GetUserData(userId).then(data => {
                if (data.approvers.length > 0 && data.approvers[0].id !== undefined) {
                    var approver = data.approvers[0];

                    areaCoordinator = {
                        "id": approver.id,
                        "section": "Area Coordination",
                        "name": approver.fullname,
                        "position": approver.position !== null ? approver.position.name : "",
                        "department": approver.department !== null ? approver.department.name : "",
                        "image": approver.image,
                        "email": approver.email
                    };
                }

                if (data.resourceManagers.length > 0 && data.resourceManagers[0].id !== undefined) {
                    var resourceManager = data.resourceManagers[0];

                    resourceManager = {
                        "id": resourceManager.id,
                        "section": "Resource Management",
                        "name": resourceManager.fullname,
                        "position": resourceManager.position !== null ? resourceManager.position.name : "",
                        "department": resourceManager.department !== null ? resourceManager.department.name : "",
                        "image": resourceManager.image,
                        "email": resourceManager.email
                    };
                }

                this.setState({
                    areaCoordinator: areaCoordinator,
                    resourceManager: resourceManager
                });
            }).catch(data => {
              
                console.log("user data error", data);
              
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.userId !== undefined && nextProps.userId !== null) {
            this.getUser(nextProps.userId);
            this.getRelatedUsers(nextProps.userId);
        }
    }

    componentDidMount() {
        if (this.props.userId !== undefined && this.props.userId !== null) {
            this.getUser(this.props.userId);
            this.getRelatedUsers(this.props.userId);
        }
    }


    render() {
        let basePage = new BasePage();

        var multiple = false;

        if (this.state.similarSkilledUsers.length > 1)
            multiple = true;

    	return (
    		<div className="employee-related-employees">
                {this.state.areaCoordinator !== null && this.state.areaCoordinator.hasOwnProperty('id') ?
                    <RelatedEmployee user={this.state.areaCoordinator} />
                : null }
                {this.state.resourceManager !== null && this.state.resourceManager.hasOwnProperty('id') ?
                    <RelatedEmployee user={this.state.resourceManager} />
                : null }
                {basePage.ResourceManagerLoggedIn() && this.state.currentSimilarSkilledUser !== null && this.state.currentSimilarSkilledUser.hasOwnProperty('id')?
                    <RelatedEmployee user={this.state.currentSimilarSkilledUser} similar="true" multiple={multiple} similarSkilledUsers={this.state.similarSkilledUsers} />
    		    : null}
            </div>
    	);
    }

}