/**
 * Pages: FAQ
 */

// Dependencies
import React from 'react';
import BasePage from './BasePage';
import Header from '../components/Header';

// Class: FAQ
export default class PageError extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			errNumber: "404",
			errString: "Page not found"
		};
	}

	componentDidMount() {
		this.fillState();
	}

	componentWillReceiveProps(nextProps) {
		this.fillState();
	}

	fillState() {
		let errNumber = (this.props.location.query.errNumber !== undefined && this.props.location.query.errNumber !== null? this.props.location.query.errNumber : "404");
		let errString = (this.props.location.query.errString !== undefined && this.props.location.query.errString !== null? this.props.location.query.errString : "Page not found");

		this.setState({
			errNumber: errNumber,
			errString: errString
		});
	}

    render() {
        return (
            <div className="errorPage">
                <h2>This is somewhat embarrassing, isn’t it?</h2>

                <div className="errorNumber">
                	<div className="number">{this.state.errNumber}</div>
                	<div className="string">{this.state.errString}</div>
                </div>
            </div>
        )
    }
}
