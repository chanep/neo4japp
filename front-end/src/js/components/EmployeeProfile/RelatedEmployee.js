import React from "react";

import { Link } from "react-router";

export default class RelatedEmployee extends React.Component {

    constructor(){
        super();

    }

    render() {
    	return (
    		<div className="related-employee">
    			<div className="header">Area Coordinator</div>
    			<div className="employeeData">
    				<div className="picture">-</div>
    				<div className="nameData">
    					<div className="name">Leopoldo Simini</div>
    					<div className="position">Executive Technology Director</div>
    					<div className="area">Technology</div>
    				</div>
    				<div className="mail"></div>
    			</div>
    		</div>
    	);
    }

}