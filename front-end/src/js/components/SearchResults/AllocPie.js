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

	componentWillReceiveProps(nextProps) {
		this.setState({
			obj: nextProps.obj,
			key: nextProps.key
		});
	}

	render() {
		let percent = this.state.obj.obj * 360 / 40;
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

		return(
        	<div className="pieAllocation" title={this.state.obj.obj + '/40'}>
        		<div className="pieBackground"></div>
        		<div className="pieSlice hold"><div className="pie" style={style}></div></div>
        		{percent2 > 0 ?
        			<div className="pieSlice2 hold"><div className="pie" style={style2}></div></div>
        		: null}
        	</div>
		);
	}
}