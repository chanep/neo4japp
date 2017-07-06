/**
 * Pages: SearchResults
 */

// Dependencies
import React from 'react';
import BasePage from './BasePage';
import Header from '../components/Header';
import SearchServices from '../services/SearchServices';
import SearchResultsTable from '../components/SearchResults/SearchResultsTable';
import ENV from '../../config';

import { hashHistory, Link, browserHistory, withRouter } from "react-router";

// Class: SearchResults
export default class SearchResults extends BasePage {
	constructor(props) {
		super(props);

        this.searchServices = new SearchServices();
				let searchState = this.searchServices.GetSearchStateFromLocationQuery(this.props.location.query);


        this.state = {
            "data": [],
            "skillsCount": 0,
            "searching": true,
						searchState: searchState
        };
				//console.log(this.context.router);
	}

    onLocationsChanged(locationId, e) {
				var newSearchState = Object.assign({}, this.state.searchState);

        var locationsIds = newSearchState.locationsIds,
            index = locationsIds.indexOf(locationId);

        if (index === -1) {
            locationsIds.push(locationId);
        } else {
            locationsIds.splice(index, 1);
        }

        this.searchServices.UpdateSearchState(newSearchState);
    }

    allLocationsSelected() {
				var newSearchState = Object.assign({}, this.state.searchState);
				newSearchState.locationsIds = [];
				this.searchServices.UpdateSearchState(newSearchState);
    }

    onLevelChanged(levelId, e) {
				var newSearchState = Object.assign({}, this.state.searchState);

        var levelsIds = newSearchState.levelsIds,
            index = levelsIds.indexOf(levelId);

        if (index === -1) {
            levelsIds.push(levelId);
        } else {
            levelsIds.splice(index, 1);
        }

        this.searchServices.UpdateSearchState(newSearchState);
    }

    allLevelsSelected() {
			var newSearchState = Object.assign({}, this.state.searchState);
			newSearchState.levelsIds = [];
			this.searchServices.UpdateSearchState(newSearchState);
    }

    sortBy(sortBy) {
			var newSearchState = Object.assign({}, this.state.searchState);
			newSearchState.sortBy = newSearchState.sortBy == sortBy ? 'relevance' : sortBy;
			this.searchServices.UpdateSearchState(newSearchState);
    }

    getData() {
        let self = this;

        this.setState({searching: true});

        if (this.state.searchState.skillsIds.length > 0 || this.state.searchState.interestsIds.length > 0 || this.state.searchState.clientsIds.length > 0) {
            this.searchServices.GetSearchBySkills(this.state.searchState.skillsIds, this.state.searchState.interestsIds, this.state.searchState.clientsIds, ENV().search.resultsLimit, this.state.searchState.locationsIds, this.state.searchState.levelsIds, this.state.searchState.sortBy).then(data => {
                self.setState({
                    data: data,
                    skillsCount: this.state.searchState.skillsIds.length,
                    searching: false
                });
            }).catch(data => {
                console.log("Error performing search", data);
            });
        } else {
            this.setState({data: [], skillsCount: 0, searching: false});
        }
    }

    componentDidMount() {
				let searchState = this.searchServices.GetSearchStateFromLocationQuery(this.props.location.query);
				this.setState({searchState: searchState});
        this.getData();
    }

    componentWillReceiveProps(newProps) {
				let searchState = this.searchServices.GetSearchStateFromLocationQuery(newProps.location.query);
				this.setState({searchState: searchState});
        this.getData();
    }

    render() {
        return (
            <SearchResultsTable data={this.state.data} skillsCount={this.state.skillsCount} searching={this.state.searching} locations={this.state.searchState.locationsIds} levels={this.state.searchState.levelsIds} sortBy={this.state.searchState.sortBy} onLocationsChanged={this.onLocationsChanged.bind(this)} allSelected={this.allLocationsSelected.bind(this)} sortByChanged={this.sortBy.bind(this)} onLevelChanged={this.onLevelChanged.bind(this)} allLevelsSelected={this.allLevelsSelected.bind(this)} />
        );
    }
}
