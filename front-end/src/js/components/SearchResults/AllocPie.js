import React from 'react';
import { Router, Route, Link } from 'react-router'
import ReactTooltip from 'react-tooltip'
import moment from "moment";

// Class: SearchResult
export default class AllocPie extends React.Component {
	constructor(obj) {
		super(obj);

		this.state = {
			startWeek: null,
			allocatedHour: 0,
			totalWeekHour: 0,
			currentEmployee: null
		}
	}

	componentDidMount() {
    	this.setState({
    		startWeek: this.props.startWeek,
    		allocatedHour: this.props.allocatedHour !== -1 && this.props.allocatedHour !== "-1"? this.props.allocatedHour : 0,
    		totalWeekHour: this.props.totalWeekHour !== -1 && this.props.totalWeekHour !== "-1"? this.props.totalWeekHour : 0,
    		currentEmployee: this.props.currentEmployee
    	});
    }

	componentWillReceiveProps(nextProps) {
		this.setState({
			startWeek: nextProps.startWeek,
			allocatedHour: nextProps.allocatedHour !== -1 && nextProps.allocatedHour !== "-1"? nextProps.allocatedHour : 0,
			totalWeekHour: nextProps.totalWeekHour !== -1 && nextProps.totalWeekHour !== "-1"? nextProps.totalWeekHour : 0,
			currentEmployee: nextProps.currentEmployee
		});
	}

	makeid()
	{
    	var text = "";
    	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    	for( var i=0; i < 15; i++ )
        	text += possible.charAt(Math.floor(Math.random() * possible.length));

    	return text;
	}

	render() {
		let percent = 360;
		let totalPercent = 0;
		if (this.state.totalWeekHour > 0) {
			percent = this.state.allocatedHour * 360 / this.state.totalWeekHour;
			totalPercent = parseInt((this.state.allocatedHour / this.state.totalWeekHour) * 100.00, 10);
		}

		if (percent > 360) percent = 360;
		let percent2 = 0;

		let propVale1 = 'rotate(' + percent + 'deg)';
		let propVale2 = '';
		if (percent > 180) {
			percent2 = percent - 180;
			percent = 180;

			propVale1 = 'rotate(' + percent + 'deg)';
			propVale2 = 'rotate(' + percent2 + 'deg)';
		}

		let style = {
			WebkitTransform: propVale1,
            MozTransform: propVale1,
            OTransform: propVale1,
            transform: propVale1
		}

		let style2 = {
			WebkitTransform: propVale2,
            MozTransform: propVale2,
            OTransform: propVale2,
            transform: propVale2
		}

		let newId = "tooltip_" + this.makeid();

		return(
        	<div className="pieAllocation" data-tip data-for={newId}>
        		<div className="pieBackground"></div>
        		<div className="pieSlice hold"><div className="pie" style={style}></div></div>
        		{percent2 > 0 ?
        			<div className="pieSlice2 hold"><div className="pie" style={style2}></div></div>
        		: null}
        		<ReactTooltip id={newId} delayHide={100} effect='solid' class="tooltipFormat">
        			{this.state.startWeek !== null? <div>Week {moment(this.state.startWeek).format("MM/DD/YYYY")}</div> : null}
        			<div>{totalPercent}% Allocated ({this.state.allocatedHour + '/' + this.state.totalWeekHour})</div>
        			{this.state.currentEmployee !== null && this.state.currentEmployee !== undefined?<div className="viewLink"><a href={"http://reporter/newallocations/EmployeeAllocation.aspx?EmpId=" + this.state.currentEmployee} target="_blank">VIEW ALLOCATIONS</a></div>:null}
        		</ReactTooltip>
        	</div>
		);
	}
}