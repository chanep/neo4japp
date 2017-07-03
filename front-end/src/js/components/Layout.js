import React from "react";

import { Link } from "react-router";
import SearchServices from '../services/SearchServices';
import AlertContainer from 'react-alert';
import BasePage from "../pages/BasePage";
import Header from "./Header";
import Footer from "./Footer";

export default class Layout extends React.Component {
	constructor(props) {
		super(props);

		this.basePage = new BasePage();
		this.searchServices = new SearchServices();

		console.log(this.props.location.query);
		console.log(this.searchServices.GetSearchStateFromLocationQuery(this.props.location.query));

		let searchState = this.searchServices.GetSearchStateFromLocationQuery(this.props.location.query);

		this.state = Object.assign({isLoggedIn: false, searchIsAvailable: false, searchState});

		this.alertOptions = {
            offset: 14,
            position: 'top left',
            theme: 'dark',
            time: 5000,
            transition: 'fade'
        };

		console.log(this.state);

		this.basePage._isUserLoggedIn().then(isLoggedIn => {
			this.setState({isLoggedIn: isLoggedIn, searchIsAvailable: isLoggedIn && this.basePage._showSearch()});
			console.log(this.state);
		});
	}

	componentWillReceiveProps(newProps) {
		this.setState(this.searchServices.GetSearchStateFromLocationQuery(newProps.location.query));
		console.log(this.state);

		this.basePage._isUserLoggedIn().then(isLoggedIn => {
			this.setState({isLoggedIn: isLoggedIn, searchIsAvailable: isLoggedIn && this.basePage._showSearch()});
			console.log(this.state);
		});
	}

	render () {
		return (
			<div>
				<AlertContainer ref={(a) => global.msg = a} {...this.alertOptions} />
				<Header search={this.state.searchIsAvailable} loggedIn={this.state.isLoggedIn} skillsIds={this.state.skillsIds} interestsIds={this.state.interestsIds} clientsIds={this.state.clientsIds} />
				{this.props.children}
				<Footer />
			</div>
		);
	}
}
