import React from "react";

import { Link } from "react-router";

export default class RelatedEmployee extends React.Component {

    constructor(){
        super();

        this.state = {
            user: []
        };
    }

    componentWillReceiveProps(newProps) {
        this.setState({ user: newProps });
    }

    render() {
        var section = this.props.section,
            image = this.props.image,
            name = this.props.name,
            position = this.props.position,
            department = this.props.department;

    	return (
    		<div className="related-employee">
    			<div className="header">{section}</div>
    			<div className="employeeData">
    				<div className="picture"><img src="{image}" /></div>
    				<div className="nameData">
    					<div className="name">{name}</div>
    					<div className="position">{position}</div>
    					<div className="area">{department}</div>
    				</div>
    				<div className="mail"></div>
    			</div>
    		</div>
    	);
    }

}