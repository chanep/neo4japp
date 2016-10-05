import React from "react";

import { Link } from "react-router";
import RelatedEmployee from './RelatedEmployee';

export default class RelatedEmployees extends React.Component {

    constructor() {
        super();
    }

    render() {
    	return (
    		<div className="employee-related-employees">
    			<RelatedEmployee />
    			<RelatedEmployee />
    			<RelatedEmployee />
    		</div>
    	);
    }

}