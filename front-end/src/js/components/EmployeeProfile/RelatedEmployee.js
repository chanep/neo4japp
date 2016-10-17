import React from "react";

import { Link } from "react-router";

export default class RelatedEmployee extends React.Component {

    constructor(){
        super();

        this.state = {
            data: [],
            index: 0
        };

        this.goToPrev = this.goToPrev.bind(this);
        this.goToNext = this.goToNext.bind(this);
    }

    componentWillReceiveProps(newProps) {
        this.setState({ data: newProps });
    }

    goToPrev() {
        var index = this.state.index;

        if (index - 1 >= 0)
            index--;
        else
            index = this.state.data['similarSkilledUsers'].length - 1;

        this.setState({ index: index });
    }

    goToNext() {
        var index = this.state.index;

        if (index + 1 < this.state.data['similarSkilledUsers'].length)
            index++;
        else
            index = 0;

        this.setState({ index: index });
    }

    render() {
        var user = this.props.user;

        if (this.state.data.similarSkilledUsers != undefined) {
            user = this.state.data.similarSkilledUsers[this.state.index];
        }

    	return (
    		<div className="related-employee">
    			<div className="header">{user.section}</div>
    			<div className="employeeData">
    				<div className="picture"><img src="{user.image}" /></div>
    				<div className="nameData">
    					<div className="name">{user.name}</div>
    					<div className="position">{user.position}</div>
    					<div className="area">{user.department}</div>
    				</div>
                    {this.props.similar ?
    				    <div className="arrows"><span onClick={this.goToPrev}>&lt;</span> <span onClick={this.goToNext}>&gt;</span></div>
                    : <div className="mail"></div>}
    			</div>
    		</div>
    	);
    }

}