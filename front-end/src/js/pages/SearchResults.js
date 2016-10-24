/**
 * Pages: SearchResults
 */

// Dependencies
import React from 'react';
import BasePage from './BasePage';
import Header from '../components/Header';
import SearchServices from '../services/SearchServices';
import SearchResultsTable from '../components/SearchResults/SearchResultsTable';

// Class: SearchResults
export default class SearchResults extends BasePage {
	constructor(props) {
		super(props);

        let locations = [];
        if (this.props.location.search !== undefined) {
            locations.push(this.props.location.search.split("=")[1]);
        }

        let ids = this.props.params.skillIds.split(',');

        this.searchServices = new SearchServices();
        this.state = {
            "data": [],
            "skillsCount": 0,
            "searching": true,
            "skillsIds": ids,
            "locations": locations,
            "key": 0
        };

        this.addLocation = this.addLocation.bind(this);
	}

    addLocation(locationId) {
        var locations = this.state.locations;
        locations.push(locationId);

        this.setState({ "locations": locations });

        this.getData(this.state.skillsIds);

        console.log(this.state.key);

        this.setState({ key: Math.random() });
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

            this.getData(ids);
        }
    }

    componentWillReceiveProps(newProps) {
        if (newProps.params.skillIds !== undefined) {
            let ids = newProps.params.skillIds.split(',');

            this.getData(ids);
        }
    }

    render() {
        return (
            <div>
                <Header search={super._showSearch()} loggedIn={true} />
                <SearchResultsTable key={this.state.key} data={this.state.data} skillsCount={this.state.skillsCount} searching={this.state.searching} locations={this.state.locations} addLocation={this.addLocation} />
            </div>
        );
    }
}
