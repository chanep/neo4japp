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

        let locationsIds = [];
        if (this.props.params.locationsIds !== undefined) {
            locationsIds = this.props.params.locationsIds.split(',');
        }

        let interestsIds = [];
        if (this.props.params.interestsIds !== undefined) {
            interestsIds = this.props.params.interestsIds.split(',');
        }

        let skillsIds = [];
        if (this.props.params.skillsIds !== undefined) {
            skillsIds = this.props.params.skillsIds.split(',');
        }

        this.searchServices = new SearchServices();
        this.state = {
            "data": [],
            "skillsCount": 0,
            "searching": true,
            "skillsIds": skillsIds,
            "interestsIds": interestsIds,
            "locationsIds": locationsIds
        };
	}

    onLocationsChanged(locationId, e) {
        var locationsIds = this.state.locationsIds,
            index = locationsIds.indexOf(locationId);

        if (index === -1) {
            locationsIds.push(locationId);
        } else {
            locationsIds.splice(index, 1);
        }

        var skillsConcat = this.state.skillsIds.join(),
            interestsConcat = this.state.interestsIds.join(),
            locationsConcat = this.state.locationsIds.join(),
            path = '/searchresults';

        if (this.state.skillsIds.length > 0)
            path += '/skills/' + skillsConcat;

        if (this.state.interestsIds.length > 0)
            path += '/interests/' + interestsConcat;

        if (locationsIds.length > 0)
            path += '/locations/' + locationsConcat;

        this.context.router.push({ pathname: path });
    }

    allSelected() {
        var skillsConcat = this.state.skillsIds.join(),
            interestsConcat = this.state.interestsIds.join(),
            path = '/searchresults';

        if (this.state.skillsIds.length > 0)
            path += '/skills/' + skillsConcat;

        if (this.state.interestsIds.length > 0)
            path += '/interests/' + interestsConcat;

        this.context.router.push({ pathname: path });
    }

    getData(skillsIds, interestsIds, locationsIds) {
        let self = this;

        this.setState({data: [], skillsIds: [], interestsIds: [], locationsIds: [], skillsCount: 0, searching: true});
        if (skillsIds.length > 0 || interestsIds.length > 0) {
            this.searchServices.GetSearchBySkills(skillsIds, interestsIds, ENV().search.resultsLimit, locationsIds).then(data => {
                self.setState({
                    data: data,
                    skillsIds: skillsIds,
                    interestsIds: interestsIds,
                    locationsIds: locationsIds,
                    skillsCount: skillsIds.length,
                    searching: false
                });
            }).catch(data => {
                console.log("Error performing search", data);
            });
        } else {
            this.setState({data: [], skillsIds: skillsIds, interestsIds: interestsIds, locationsIds: locationsIds, skillsCount: 0, searching: false});
        }
    }

    componentDidMount() {
        let skillsIds = [];
        let interestsIds = [];
        let locationsIds = [];

        if (this.props.params.skillsIds !== undefined) {
            skillsIds = this.props.params.skillsIds.split(',');
        }

        if (this.props.params.interestsIds !== undefined) {
            interestsIds = this.props.params.interestsIds.split(',');
        }

        if (this.props.params.locationsIds !== undefined) {
            locationsIds = this.props.params.locationsIds.split(',');
        }

        this.getData(skillsIds, interestsIds, locationsIds);
    }

    componentWillReceiveProps(newProps) {
        let skillsIds = [];
        let interestsIds = [];
        let locationsIds = [];

        if (newProps.params.skillsIds !== undefined) {
            skillsIds = newProps.params.skillsIds.split(',');
        }

        if (newProps.params.interestsIds !== undefined) {
            interestsIds = newProps.params.interestsIds.split(',');
        }

        if (newProps.params.locationsIds !== undefined) {
            locationsIds = newProps.params.locationsIds.split(',');
        }

        this.getData(skillsIds, interestsIds, locationsIds);
    }

    render() {
        return (
            <div>
                <Header search={super._showSearch()} loggedIn={true} skillsIds={this.state.skillsIds} interestsIds={this.state.interestsIds} />
                <SearchResultsTable data={this.state.data} skillsCount={this.state.skillsCount} searching={this.state.searching} locations={this.state.locationsIds} onLocationsChanged={this.onLocationsChanged.bind(this)} allSelected={this.allSelected.bind(this)} />
            </div>
        );
    }
}
