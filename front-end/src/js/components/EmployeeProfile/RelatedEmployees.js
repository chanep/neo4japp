import React from "react";

import { Link } from "react-router";
import RelatedEmployee from './RelatedEmployee';
import UserServices from '../../services/UserServices';

export default class RelatedEmployees extends React.Component {

    constructor() {
        super();

        this.query = this.query.bind(this);
    }

    query() {
        let userService = new UserServices();

        var userId = 981;

        userService.GetSimilarSkilledUsers(userId).then(data =>{
            console.log(data);
        });
    }

    render() {
        this.query();

    	return (
    		<div className="employee-related-employees">
    			<RelatedEmployee />
    			<RelatedEmployee />
    			<RelatedEmployee />
    		</div>
    	);
    }

}