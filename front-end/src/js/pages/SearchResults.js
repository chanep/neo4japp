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
        if (this.props.location.query.locations !== undefined) {
            locationsIds = this.props.location.query.locations.split(',');
        }

        let interestsIds = [];
        if (this.props.location.query.interests !== undefined) {
            interestsIds = this.props.location.query.interests.split(',');
        }

        let skillsIds = [];
        if (this.props.location.query.skills !== undefined) {
            skillsIds = this.props.location.query.skills.split(',');
        }

        let clientsIds = [];
        if (this.props.location.query.clients !== undefined) {
            clientsIds = this.props.location.query.clients.split(',');
        }

        let levelsIds = [];
        if (this.props.location.query.levels !== undefined) {
            levelsIds = this.props.location.query.levels.split(',');
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
            "levelsIds": levelsIds,
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
            levelsConcat = this.state.levelsIds.join(),
            path = "";

        if (this.state.skillsIds.length > 0)
            path += (path !== ""? '&' : '') + 'skills=' + skillsConcat;

        if (this.state.interestsIds.length > 0)
            path += (path !== ""? '&' : '') + 'interests=' + interestsConcat;

        if (this.state.clientsIds.length > 0)
            path += (path !== ""? '&' : '') + 'clients=' + clientsConcat;

        if (this.state.levelsIds.length > 0)
            path += (path !== ""? '&' : '') + 'levels=' + levelsConcat;

        if (locationsIds.length > 0)
            path += (path !== ""? '&' : '') + 'locations=' + locationsConcat;

        path += (path !== ""? '&' : '') + 'orderBy=' + this.state.sortBy;

        path = '/searchresults?' + path;

        this.context.router.push({ pathname: path });
    }

    allSelected() {
        var skillsConcat = this.state.skillsIds.join(),
            interestsConcat = this.state.interestsIds.join(),
            clientsConcat = this.state.clientsIds.join(),
            levelsConcat = this.state.levelsIds.join(),
            path = '';

        if (this.state.skillsIds.length > 0)
            path += (path !== ""? '&' : '') + 'skills=' + skillsConcat;

        if (this.state.interestsIds.length > 0)
            path += (path !== ""? '&' : '') + 'interests=' + interestsConcat;

        if (this.state.clientsIds.length > 0)
            path += (path !== ""? '&' : '') + 'clients=' + clientsConcat;

        if (this.state.levelsIds.length > 0)
            path += (path !== ""? '&' : '') + 'levels=' + levelsConcat;

        path += (path !== ""? '&' : '') + 'orderBy=' + this.state.sortBy;

        path = "/searchresults?" + path;

        this.context.router.push({ pathname: path });
    }

    onLevelChanged(levelId, e) {
        var levelsIds = this.state.levelsIds,
            index = levelsIds.indexOf(levelId);

        if (index === -1) {
            levelsIds.push(levelId);
        } else {
            levelsIds.splice(index, 1);
        }

        var skillsConcat = this.state.skillsIds.join(),
            interestsConcat = this.state.interestsIds.join(),
            clientsConcat = this.state.clientsIds.join(),
            locationsConcat = this.state.locationsIds.join(),
            levelsConcat = this.state.levelsIds.join(),
            path = "";

        if (this.state.skillsIds.length > 0)
            path += (path !== ""? '&' : '') + 'skills=' + skillsConcat;

        if (this.state.interestsIds.length > 0)
            path += (path !== ""? '&' : '') + 'interests=' + interestsConcat;

        if (this.state.clientsIds.length > 0)
            path += (path !== ""? '&' : '') + 'clients=' + clientsConcat;

        if (this.state.levelsIds.length > 0)
            path += (path !== ""? '&' : '') + 'levels=' + levelsConcat;

        if (this.state.locationsIds.length > 0)
            path += (path !== ""? '&' : '') + 'locations=' + locationsConcat;

        path += (path !== ""? '&' : '') + 'orderBy=' + this.state.sortBy;

        path = '/searchresults?' + path;

        this.context.router.push({ pathname: path });
    }

    allLevelsSelected() {
        var skillsConcat = this.state.skillsIds.join(),
            interestsConcat = this.state.interestsIds.join(),
            clientsConcat = this.state.clientsIds.join(),
            locationsConcat = this.state.locationsIds.join(),
            path = '';

        // Fix SKLLSRCH-159
        this.setState({ 'levelsIds': [] });

        if (this.state.skillsIds.length > 0)
            path += (path !== ""? '&' : '') + 'skills=' + skillsConcat;

        if (this.state.interestsIds.length > 0)
            path += (path !== ""? '&' : '') + 'interests=' + interestsConcat;

        if (this.state.clientsIds.length > 0)
            path += (path !== ""? '&' : '') + 'clients=' + clientsConcat;

        if (this.state.locationsIds.length > 0)
            path += (path !== ""? '&' : '') + 'locations=' + locationsConcat;

        path += (path !== ""? '&' : '') + 'orderBy=' + this.state.sortBy;

        path = "/searchresults?" + path;

        this.context.router.push({ pathname: path });
    }

    sortBy(sortBy) {
        this.getData(this.state.skillsIds, this.state.interestsIds, this.state.clientsIds, this.state.locationsIds, this.state.levelsIds, sortBy);
    }

    getData(skillsIds, interestsIds, clientsIds, locationsIds, levelsIds, sortBy) {
        let self = this;

        this.setState({data: [], skillsIds: [], interestsIds: [], clientsIds: [], locationsIds: [], skillsCount: 0, searching: true, sortBy: sortBy});
        if (skillsIds.length > 0 || interestsIds.length > 0 || clientsIds.length > 0) {
            this.searchServices.GetSearchBySkills(skillsIds, interestsIds, clientsIds, ENV().search.resultsLimit, locationsIds, levelsIds, sortBy).then(data => {
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
        let levelsIds = [];
        let sortBy = "relevance";

        if (this.props.location.query.skills !== undefined) {
            skillsIds = this.props.location.query.skills.split(',');
        }

        if (this.props.location.query.interests !== undefined) {
            interestsIds = this.props.location.query.interests.split(',');
        }

        if (this.props.location.query.clients !== undefined) {
            clientsIds = this.props.location.query.clients.split(',');
        }

        if (this.props.location.query.locations !== undefined) {
            locationsIds = this.props.location.query.locations.split(',');
        }

        if (this.props.location.query.levels !== undefined) {
            levelsIds = this.props.location.query.levels.split(',');
        }

        if (this.props.location.query.orderBy !== undefined && this.props.location.query.orderBy !== "undefined" && this.props.location.query.orderBy !== "" && this.props.location.query.orderBy !== null) {
            sortBy = this.props.location.query.orderBy;
        }

        this.getData(skillsIds, interestsIds, clientsIds, locationsIds, levelsIds, sortBy);
    }

    componentWillReceiveProps(newProps) {
        let skillsIds = [];
        let interestsIds = [];
        let clientsIds = [];
        let locationsIds = [];
        let levelsIds = [];
        let sortBy = "relevance";

        if (newProps.location.query.skills !== undefined) {
            skillsIds = newProps.location.query.skills.split(',');
        }

        if (newProps.location.query.interests !== undefined) {
            interestsIds = newProps.location.query.interests.split(',');
        }

        if (newProps.location.query.clients !== undefined) {
            clientsIds = newProps.location.query.clients.split(',');
        }

        if (newProps.location.query.locations !== undefined) {
            locationsIds = newProps.location.query.locations.split(',');
        }

        if (newProps.location.query.levels !== undefined) {
            levelsIds = newProps.location.query.levels.split(',');
        }

        if (newProps.location.query.orderBy !== undefined && newProps.location.query.orderBy !== "undefined" && newProps.location.query.orderBy !== "" && newProps.location.query.orderBy !== null) {
            sortBy = newProps.location.query.orderBy;
        }

        this.getData(skillsIds, interestsIds, clientsIds, locationsIds, levelsIds, sortBy);
    }

    render() {
        return (
            <div>
                <Header search={super._showSearch()} loggedIn={true} skillsIds={this.state.skillsIds} interestsIds={this.state.interestsIds} clientsIds={this.state.clientsIds} />
                <SearchResultsTable data={this.state.data} skillsCount={this.state.skillsCount} searching={this.state.searching} locations={this.state.locationsIds} levels={this.state.levelsIds} sortBy={this.state.sortBy} onLocationsChanged={this.onLocationsChanged.bind(this)} allSelected={this.allSelected.bind(this)} sortByChanged={this.sortBy.bind(this)} onLevelChanged={this.onLevelChanged.bind(this)} allLevelsSelected={this.allLevelsSelected.bind(this)} />
            </div>
        );
    }
}
