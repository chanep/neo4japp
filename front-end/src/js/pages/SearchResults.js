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

    getData(searchState) {
        let self = this;

        this.setState({searching: true, searchState: searchState});

        if (searchState.skillsIds.length > 0 || searchState.interestsIds.length > 0 || searchState.clientsIds.length > 0) {
            this.searchServices.GetSearchBySkills(searchState.skillsIds, searchState.interestsIds, searchState.clientsIds, ENV().search.resultsLimit, searchState.locationsIds, searchState.levelsIds, searchState.sortBy).then(data => {
                self.setState({
                    data: data,
                    skillsCount: searchState.skillsIds.length,
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
        this.getData(searchState);
    }

    componentWillReceiveProps(newProps) {
				let searchState = this.searchServices.GetSearchStateFromLocationQuery(newProps.location.query);
        this.getData(searchState);
    }

    render() {
        return (
            <SearchResultsTable data={this.state.data} skillsCount={this.state.skillsCount} searching={this.state.searching} locations={this.state.searchState.locationsIds} levels={this.state.searchState.levelsIds} sortBy={this.state.searchState.sortBy} onLocationsChanged={this.onLocationsChanged.bind(this)} allSelected={this.allLocationsSelected.bind(this)} sortByChanged={this.sortBy.bind(this)} onLevelChanged={this.onLevelChanged.bind(this)} allLevelsSelected={this.allLevelsSelected.bind(this)} />
        );
    }
}
