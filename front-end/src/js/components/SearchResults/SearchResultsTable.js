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

    constructor() {
        super();

        this.state = {
        	data: []
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({data: nextProps.data});
    }

    render() {
        return (
            <div className="search-results-table">
                <div className="header-bar">
                    <div className="col -col-3">
                        <span className="table-header">Filter</span>
                    </div>
                    <div className="col -col-4">
                        <span className="table-header">Employee</span>
                    </div>
                    <div className="col -col-1">
                        <span className="table-header">Location</span>
                    </div>
                    <div className="col -col-1">
                        <span className="table-header">Skill</span>
                    </div>
                    <div className="col -col-2">
                        <span className="table-header">Allocation per week</span>
                    </div>
                    <div className="col -col-1">&nbsp;</div>
                </div>
                <div className="results-section">

                    {/*FILTERS SIDE BAR*/}
                    <FiltersSideBar /> 

                    <ul className="results col -col-9 -col-no-gutter">
                    	{
                    		this.state.data.map((x, i) =>
                    			<SearchResult obj={x} key={i} skillsCount={1} />
                    		)
                    	}
                    </ul>
                </div>
            </div>
        );
    }
}
