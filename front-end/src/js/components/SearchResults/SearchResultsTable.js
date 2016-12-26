/**
 * Components: SearchResultsTable
 */

// Dependencies
import React from 'react';
import FiltersSideBar from '../../components/FiltersSideBar';
import { Router, Route, Link } from 'react-router'
import SearchResult from '../../components/SearchResults/SearchResult';

// Class: SearchResultsTable
export default class SearchResultsTable extends React.Component {

    constructor(data) {
        super();

        this.state = {
        	data: data.data,
            skillsCount: data.skillsCount,
            searching: data.searching,
            locationsIds: data.locations,
            sortBy: data.sortBy
        };
    }

    componentWillReceiveProps(nextProps) {
        console.log("componentWillReceiveProps", nextProps);
        this.setState({
            data: nextProps.data,
            skillsCount: nextProps.skillsCount,
            searching: nextProps.searching,
            locationsIds: nextProps.locations,
            sortBy: nextProps.sortBy
        });
    }

    onLocationsChanged(locationId, e) {
        this.props.onLocationsChanged(locationId);
    }

    allSelected() {
        this.props.allSelected();
    }

    sortBy(sortBy) {
        this.props.sortByChanged(sortBy);
    }

    render() {
        return (
            <div className="search-results-table">
                <div className="header-bar">
                    <div className="col -col-3">
                        <span className="header-label">Filter</span>
                    </div>
                    <div className="col -col-4">
                        <span className={"header-label " + (this.state.sortBy === "fullname_asc"? "selected" : "clicleable")} onClick={this.sortBy.bind(this, 'fullname_asc')}>Employee</span>
                    </div>
                    <div className="col -col-1">
                        <span className={"header-label " + (this.state.sortBy === "office_asc"? "selected" : "clicleable")} onClick={this.sortBy.bind(this, 'office_asc')}>Location</span>
                    </div>
                    <div className="col -col-1">
                        <span className={"header-label " + (this.state.sortBy === "matchedItems"? "selected" : "clicleable")} onClick={this.sortBy.bind(this, 'matchedItems')}>Skill</span>
                    </div>
                    <div className="col -col-2">
                        <span className={"header-label " + (this.state.sortBy === "allocation"? "selected" : "clicleable")} onClick={this.sortBy.bind(this, 'allocation')}>Allocation per week</span>
                    </div>
                    <div className="col -col-1">&nbsp;</div>
                </div>
                <div className="results-section">

                    {/*FILTERS SIDE BAR*/}
                    <FiltersSideBar locations={this.state.locationsIds} onLocationsChanged={this.onLocationsChanged.bind(this)} allSelected={this.allSelected.bind(this)} /> 

                    <ul className="results col -col-9 -col-no-gutter">
                    	{
                            this.state.searching ?
                                <li className="performingSearch">Searching...</li>
                            :
                                this.state.data.length == 0 ?
                                    <li className="noResults">No results found for your search</li>
                                :
                            		this.state.data.map((x, i) =>
                                        <SearchResult obj={x} key={i} skillsCount={this.state.skillsCount} />
                                    )
                    	}
                    </ul>
                </div>
            </div>
        );
    }
}
