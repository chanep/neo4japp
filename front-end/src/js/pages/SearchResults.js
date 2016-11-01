/**
 * Pages: SearchResults
 */

// Dependencies
import React from 'react';
import BasePage from './BasePage';
import Header from '../components/Header';
import SearchServices from '../services/SearchServices';
import SearchResultsTable from '../components/SearchResults/SearchResultsTable';

import { hashHistory, Link, browserHistory, withRouter } from "react-router";

// Class: SearchResults
export default class SearchResults extends BasePage {
	constructor(props) {
		super(props);

        let locations = [];
        if (this.props.params.locationsId !== undefined) {
            locations = this.props.params.locationsId.split(',');
        }

        let ids = [];
        if (this.props.params.skillIds !== undefined) {
            ids = this.props.params.skillIds.split(",");
        }

        this.searchServices = new SearchServices();
        this.state = {
            "data": [],
            "skillsCount": 0,
            "searching": true,
            "skillsIds": ids,
            "locations": locations
        };
	}

    onLocationsChanged(locationId, e) {
        var locations = this.state.locations,
            index = locations.indexOf(locationId);

        if (index === -1) {
            locations.push(locationId);
        } else {
            locations.splice(index, 1);
        }

        var skillsConcat = this.state.skillsIds.join(),
            locationsConcat = this.state.locations.join(),
            path = '/searchresults/' + skillsConcat;

        if (locationsConcat != '')
            path = '/searchresults/' + skillsConcat + '/' + locationsConcat;

        this.context.router.push({ pathname: path });
    }

    allSelected() {
        var skillsConcat = this.state.skillsIds.join(),
            path = '/searchresults/' + skillsConcat;

        this.context.router.push({ pathname: path });
    }

    getData(ids, locations) {
        let self = this;

        this.setState({data: [], skillsIds: [], locations: [], skillsCount: 0, searching: true});
        if (ids.length > 0) {
            this.searchServices.GetSearchBySkills(ids, 20, locations).then(data => {
                self.setState({
                    data: data,
                    skillsIds: ids,
                    locations: locations,
                    skillsCount:ids.length,
                    searching: false
                });
            }).catch(data => {
                console.log("Error performing search", data);
            });
        } else {
            this.setState({data: [], skillsIds: ids, locations: locations, skillsCount: 0, searching: false});
        }
    }

    componentDidMount() {
        let ids = [];
        let locations = [];

        if (this.props.params.skillIds !== undefined) {
            ids = this.props.params.skillIds.split(',');
        }

        if (this.props.params.locationsId !== undefined) {
            locations = this.props.params.locationsId.split(',');
        }

        this.getData(ids, locations);
    }

    componentWillReceiveProps(newProps) {
        let ids = [];
        let locations = [];

        if (newProps.params.skillIds !== undefined) {
            ids = newProps.params.skillIds.split(',');
        }

        if (newProps.params.locationsId !== undefined) {
            locations = newProps.params.locationsId.split(',');
        }

        this.getData(ids, locations);
    }

    render() {
        return (
            <div>
                <Header search={super._showSearch()} loggedIn={true} skillsIds={this.state.skillsIds} />
                <SearchResultsTable data={this.state.data} skillsCount={this.state.skillsCount} searching={this.state.searching} locations={this.state.locations} onLocationsChanged={this.onLocationsChanged.bind(this)} allSelected={this.allSelected.bind(this)} />
            </div>
        );
    }
}
