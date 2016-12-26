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

        let clientsIds = [];
        if (this.props.params.clientsIds !== undefined) {
            clientsIds = this.props.params.clientsIds.split(',');
        }

        this.searchServices = new SearchServices();
        this.state = {
            "data": [],
            "skillsCount": 0,
            "searching": true,
            "skillsIds": skillsIds,
            "clientsIds": clientsIds,
            "interestsIds": interestsIds,
            "locationsIds": locationsIds,
            "sortBy": "relevance"
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
            clientsConcat = this.state.clientsIds.join(),
            locationsConcat = this.state.locationsIds.join(),
            path = '/searchresults';

        if (this.state.skillsIds.length > 0)
            path += '/skills/' + skillsConcat;

        if (this.state.interestsIds.length > 0)
            path += '/interests/' + interestsConcat;

        if (this.state.clientsIds.length > 0)
            path += '/clients/' + clientsConcat;

        if (locationsIds.length > 0)
            path += '/locations/' + locationsConcat;

        path += '?orderBy=' + this.state.sortBy;

        this.context.router.push({ pathname: path });
    }

    allSelected() {
        var skillsConcat = this.state.skillsIds.join(),
            interestsConcat = this.state.interestsIds.join(),
            clientsConcat = this.state.clientsIds.join(),
            path = '/searchresults';

        if (this.state.skillsIds.length > 0)
            path += '/skills/' + skillsConcat;

        if (this.state.interestsIds.length > 0)
            path += '/interests/' + interestsConcat;

        if (this.state.clientsIds.length > 0)
            path += '/clients/' + clientsConcat;

        path += '?orderBy=' + this.state.sortBy;

        this.context.router.push({ pathname: path });
    }

    sortBy(sortBy) {
        this.getData(this.state.skillsIds, this.state.interestsIds, this.state.clientsIds, this.state.locationsIds, sortBy);
    }

    getData(skillsIds, interestsIds, clientsIds, locationsIds, sortBy) {
        let self = this;

        this.setState({data: [], skillsIds: [], interestsIds: [], clientsIds: [], locationsIds: [], skillsCount: 0, searching: true, sortBy: sortBy});
        if (skillsIds.length > 0 || interestsIds.length > 0 || clientsIds.length > 0) {
            this.searchServices.GetSearchBySkills(skillsIds, interestsIds, clientsIds, ENV().search.resultsLimit, locationsIds, sortBy).then(data => {
                self.setState({
                    data: data,
                    skillsIds: skillsIds,
                    interestsIds: interestsIds,
                    locationsIds: locationsIds,
                    clientsIds: clientsIds,
                    skillsCount: skillsIds.length,
                    searching: false,
                    sortBy:sortBy
                });
            }).catch(data => {
                console.log("Error performing search", data);
            });
        } else {
            this.setState({data: [], skillsIds: skillsIds, interestsIds: interestsIds, clientsIds: clientsIds, locationsIds: locationsIds, skillsCount: 0, searching: false, sortBy: "relevance"});
        }
    }

    componentDidMount() {
        let skillsIds = [];
        let interestsIds = [];
        let clientsIds = [];
        let locationsIds = [];
        let sortBy = "relevance";

        if (this.props.params.skillsIds !== undefined) {
            skillsIds = this.props.params.skillsIds.split(',');
        }

        if (this.props.params.interestsIds !== undefined) {
            interestsIds = this.props.params.interestsIds.split(',');
        }

        if (this.props.params.clientsIds !== undefined) {
            clientsIds = this.props.params.clientsIds.split(',');
        }

        if (this.props.params.locationsIds !== undefined) {
            locationsIds = this.props.params.locationsIds.split(',');
        }

        if (this.props.location.query.orderBy !== undefined && this.props.location.query.orderBy !== "undefined" && this.props.location.query.orderBy !== "" && this.props.location.query.orderBy !== null) {
            sortBy = this.props.location.query.orderBy;
        }

        this.getData(skillsIds, interestsIds, clientsIds, locationsIds, sortBy);
    }

    componentWillReceiveProps(newProps) {
        let skillsIds = [];
        let interestsIds = [];
        let clientsIds = [];
        let locationsIds = [];
        let sortBy = "relevance";

        if (newProps.params.skillsIds !== undefined) {
            skillsIds = newProps.params.skillsIds.split(',');
        }

        if (newProps.params.interestsIds !== undefined) {
            interestsIds = newProps.params.interestsIds.split(',');
        }

        if (newProps.params.clientsIds !== undefined) {
            clientsIds = newProps.params.clientsIds.split(',');
        }

        if (newProps.params.locationsIds !== undefined) {
            locationsIds = newProps.params.locationsIds.split(',');
        }

        if (newProps.location.query.orderBy !== undefined && newProps.location.query.orderBy !== "undefined" && newProps.location.query.orderBy !== "" && newProps.location.query.orderBy !== null) {
            sortBy = newProps.location.query.orderBy;
        }

        this.getData(skillsIds, interestsIds, clientsIds, locationsIds, sortBy);
    }

    render() {
        return (
            <div>
                <Header search={super._showSearch()} loggedIn={true} skillsIds={this.state.skillsIds} interestsIds={this.state.interestsIds} clientsIds={this.state.clientsIds} />
                <SearchResultsTable data={this.state.data} skillsCount={this.state.skillsCount} searching={this.state.searching} locations={this.state.locationsIds} sortBy={this.state.sortBy} onLocationsChanged={this.onLocationsChanged.bind(this)} allSelected={this.allSelected.bind(this)} sortByChanged={this.sortBy.bind(this)} />
            </div>
        );
    }
}
