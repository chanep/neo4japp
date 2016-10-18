import React from "react";

import { Link } from "react-router";
import AlertContainer from 'react-alert';
import Footer from "./Footer";

export default class Layout extends React.Component {
	constructor() {
		super();

		this.alertOptions = {
            offset: 14,
            position: 'top left',
            theme: 'dark',
            time: 5000,
            transition: 'fade'
        };
	}

	render () {
		return (
			<div>
				<AlertContainer ref={(a) => global.msg = a} {...this.alertOptions} />
				{this.props.children}
				<Footer />
			</div>
		);
	}
}