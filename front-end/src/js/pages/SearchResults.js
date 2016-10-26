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
        if (this.props.location.search !== undefined) {
            var locationsString = this.props.location.search.split("=")[1];

            if (locationsString !== undefined)
                locations = locationsString.split(",");
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

        this.addLocation = this.addLocation.bind(this);
	}

    addLocation(locationId) {
        var locations = this.state.locations,
            index = locations.indexOf(locationId);

        if (index == -1) {
            locations.push(locationId);
        } else {
            locations.splice(index, 1);
        }

        this.setState({ "locations": locations });

        this.getData(this.state.skillsIds);

        var skillsConcat = this.state.skillsIds.join(),
            locationsConcat = this.state.locations.join(),
            path = '/searchresults/' + skillsConcat;

        if (locationsConcat != '')
            path = '/searchresults/' + skillsConcat + '?location=' + locationsConcat;

        this.context.router.push({ pathname: path });
    }

    getData(ids) {
        this.setState({data: [], skillsCount: 0, searching: true});

        this.searchServices.GetSearchBySkills(ids, 20, this.state.locations).then(data => {
            this.setState({
                data: data,
                skillsCount:ids.length,
                searching: false
            });
        }).catch(data => {
          
            console.log("Error performing search", data);
          
        });
    }

    componentDidMount() {
        if (this.props.params.skillIds !== undefined) {
            let ids = this.props.params.skillIds.split(',');
            this.setState({ "skillsIds": ids });

            this.getData(ids);
        }
    }

    componentWillReceiveProps(newProps) {
        if (newProps.params.skillIds !== undefined) {
            let ids = newProps.params.skillIds;
            ids = ids.split('?')[0];
            ids = ids.split(',');
            this.setState({ "skillsIds": ids });

            this.getData(ids);
        }
    }

    render() {
        return (
            <div>
                <Header search={super._showSearch()} loggedIn={true} skillsIds={this.state.skillsIds} />
                <SearchResultsTable data={this.state.data} skillsCount={this.state.skillsCount} searching={this.state.searching} locations={this.state.locations} addLocation={this.addLocation} />
            </div>
        );
    }
}
