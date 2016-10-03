import React from 'react';
import { Router, Route, Link } from 'react-router'

// Class: SearchResult
export default class AllocPie extends React.Component {
	constructor(obj, key) {
		super();

		this.state = {
			obj: obj,
			key: key
		}
	}

	render() {
		let percent = this.state.obj.obj * 360 / 40;
		if (percent > 40) percent = 360;

		let propVale = 'rotate(' + percent + 'deg)';

		let style = {
			WebkitTransform: propVale,
            MozTransform: propVale,
            OTransform: propVale,
            transform: propVale
		}

		return(
        	<div className="pieAllocation" title={this.state.obj.obj + '/40'}>
        		<div className="pieBackground"></div>
        		<div className="pieSlice hold"><div className="pie" style={style}></div></div>
        	</div>
		);
	}
}