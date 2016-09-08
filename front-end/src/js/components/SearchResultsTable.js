/**
 * Components: SearchResultsTable
 */

// Dependencies
import React from 'react';
import Search from './Header/Search';

// Class: SearchResultsTable
export default class SearchResultsTable extends React.Component {
    constructor(search, loggedIn) {
        super();
        this.state = {
            'search': search,
            'loggedIn': loggedIn
        };
    }

    render() {
        return (
            <div className="search-results-table">
                <div className="header-bar">
                    <div className="col -col-3">
                        <span className="table-header">Filter your results</span>
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
                    <div className="filters col -col-3">
                        <div>
                            <span className="filter-title">Locations</span> <span className="filter-title-group">(All)</span>
                            <ul>
                                <li className="filter-option">
                                    <label>
                                        <input type="checkbox" /> Austin
                                    </label>
                                </li>
                                <li className="filter-option">
                                    <label>
                                        <input type="checkbox" /> Bucharest
                                    </label>
                                </li>
                                <li className="filter-option">
                                    <label>
                                        <input type="checkbox" /> Buenos Aires
                                    </label>
                                </li>
                                <li className="filter-option">
                                    <label>
                                        <input type="checkbox" /> Chicago
                                    </label>
                                </li>
                                <li className="filter-option">
                                    <label>
                                        <input type="checkbox" /> Istanbul
                                    </label>
                                </li>
                                <li className="filter-option">
                                    <label>
                                        <input type="checkbox" /> London
                                    </label>
                                </li>
                                <li className="filter-option">
                                    <label>
                                        <input type="checkbox" /> Los Angeles
                                    </label>
                                </li>
                                <li className="filter-option">
                                    <label>
                                        <input type="checkbox" /> New York
                                    </label>
                                </li>
                                <li className="filter-option">
                                    <label>
                                        <input type="checkbox" /> Portland
                                    </label>
                                </li>
                                <li className="filter-option">
                                    <label>
                                        <input type="checkbox" /> São Paulo
                                    </label>
                                </li>
                                <li className="filter-option">
                                    <label>
                                        <input type="checkbox" /> San Francisco
                                    </label>
                                </li>
                                <li className="filter-option">
                                    <label>
                                        <input type="checkbox" /> Shanghai
                                    </label>
                                </li>
                                <li className="filter-option">
                                    <label>
                                        <input type="checkbox" /> Singapore
                                    </label>
                                </li>
                                <li className="filter-option">
                                    <label>
                                        <input type="checkbox" /> Sydney
                                    </label>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <span className="filter-title">Departments</span> <span className="filter-title-group">(All)</span>
                        </div>
                        <div>
                            <span className="filter-title">Position Levels</span> <span className="filter-title-group">(All)</span>
                        </div>
                    </div>
                    <div className="results col -col-9 -col-no-gutter">
                        <div className="grid">
                            <div className="col -col-4">
                                <p className="table-row-heading">Manuel Bruno Lazzaro</p>
                                <p className="table-row-small">Senior Open Standards Developer</p>
                            </div>
                            <div className="col -col-1">
                                <span className="table-row">BA</span>
                            </div>
                            <div className="col -col-1">
                                <span className="table-row">3/3</span>
                            </div>
                            <div className="col -col-2">
                                <i className="ss-icon-empty"></i>
                                <i className="ss-icon-quarter"></i>
                                <i className="ss-icon-half"></i>
                                <i className="ss-icon-three-quarters"></i>
                            </div>
                            <div className="col -col-1">
                                <i className="ss-icon-down-arrow"></i>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="col -col-4">
                                <p className="table-row-heading">First Last</p>
                                <p className="table-row-small">Position</p>
                            </div>
                            <div className="col -col-1">
                                <span className="table-row">NY(G3)</span>
                            </div>
                            <div className="col -col-1">
                                <span className="table-row">3/3</span>
                            </div>
                            <div className="col -col-2">
                                <i className="ss-icon-quarter"></i>
                                <i className="ss-icon-half"></i>
                                <i className="ss-icon-three-quarters"></i>
                                <i className="ss-icon-full"></i>
                            </div>
                            <div className="col -col-1">
                                <i className="ss-icon-down-arrow"></i>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="col -col-4">
                                <p className="table-row-heading">First Last</p>
                                <p className="table-row-small">Position</p>
                            </div>
                            <div className="col -col-1">
                                <span className="table-row">BA</span>
                            </div>
                            <div className="col -col-1">
                                <span className="table-row">3/3</span>
                            </div>
                            <div className="col -col-2">
                                <i className="ss-icon-quarter"></i>
                                <i className="ss-icon-half"></i>
                                <i className="ss-icon-three-quarters"></i>
                                <i className="ss-icon-full"></i>
                            </div>
                            <div className="col -col-1">
                                <i className="ss-icon-down-arrow"></i>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="col -col-4">
                                <p className="table-row-heading">First Last</p>
                                <p className="table-row-small">Position</p>
                            </div>
                            <div className="col -col-1">
                                <span className="table-row">BA</span>
                            </div>
                            <div className="col -col-1">
                                <span className="table-row">3/3</span>
                            </div>
                            <div className="col -col-2">
                                <i className="ss-icon-quarter"></i>
                                <i className="ss-icon-half"></i>
                                <i className="ss-icon-three-quarters"></i>
                                <i className="ss-icon-full"></i>
                            </div>
                            <div className="col -col-1">
                                <i className="ss-icon-down-arrow"></i>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="col -col-4">
                                <p className="table-row-heading">First Last</p>
                                <p className="table-row-small">Position</p>
                            </div>
                            <div className="col -col-1">
                                <span className="table-row">BA</span>
                            </div>
                            <div className="col -col-1">
                                <span className="table-row">3/3</span>
                            </div>
                            <div className="col -col-2">
                                <i className="ss-icon-quarter"></i>
                                <i className="ss-icon-half"></i>
                                <i className="ss-icon-three-quarters"></i>
                                <i className="ss-icon-full"></i>
                            </div>
                            <div className="col -col-1">
                                <i className="ss-icon-down-arrow"></i>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="col -col-4">
                                <p className="table-row-heading">First Last</p>
                                <p className="table-row-small">Position</p>
                            </div>
                            <div className="col -col-1">
                                <span className="table-row">BA</span>
                            </div>
                            <div className="col -col-1">
                                <span className="table-row">3/3</span>
                            </div>
                            <div className="col -col-2">
                                <i className="ss-icon-quarter"></i>
                                <i className="ss-icon-half"></i>
                                <i className="ss-icon-three-quarters"></i>
                                <i className="ss-icon-full"></i>
                            </div>
                            <div className="col -col-1">
                                <i className="ss-icon-down-arrow"></i>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="col -col-4">
                                <p className="table-row-heading">First Last</p>
                                <p className="table-row-small">Position</p>
                            </div>
                            <div className="col -col-1">
                                <span className="table-row">BA</span>
                            </div>
                            <div className="col -col-1">
                                <span className="table-row">3/3</span>
                            </div>
                            <div className="col -col-2">
                                <i className="ss-icon-quarter"></i>
                                <i className="ss-icon-half"></i>
                                <i className="ss-icon-three-quarters"></i>
                                <i className="ss-icon-full"></i>
                            </div>
                            <div className="col -col-1">
                                <i className="ss-icon-down-arrow"></i>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="col -col-4">
                                <p className="table-row-heading">First Last</p>
                                <p className="table-row-small">Position</p>
                            </div>
                            <div className="col -col-1">
                                <span className="table-row">BA</span>
                            </div>
                            <div className="col -col-1">
                                <span className="table-row">3/3</span>
                            </div>
                            <div className="col -col-2">
                                <i className="ss-icon-quarter"></i>
                                <i className="ss-icon-half"></i>
                                <i className="ss-icon-three-quarters"></i>
                                <i className="ss-icon-full"></i>
                            </div>
                            <div className="col -col-1">
                                <i className="ss-icon-down-arrow"></i>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="col -col-4">
                                <p className="table-row-heading">First Last</p>
                                <p className="table-row-small">Position</p>
                            </div>
                            <div className="col -col-1">
                                <span className="table-row">BA</span>
                            </div>
                            <div className="col -col-1">
                                <span className="table-row">3/3</span>
                            </div>
                            <div className="col -col-2">
                                <i className="ss-icon-quarter"></i>
                                <i className="ss-icon-half"></i>
                                <i className="ss-icon-three-quarters"></i>
                                <i className="ss-icon-full"></i>
                            </div>
                            <div className="col -col-1">
                                <i className="ss-icon-down-arrow"></i>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="col -col-4">
                                <p className="table-row-heading">First Last</p>
                                <p className="table-row-small">Position</p>
                            </div>
                            <div className="col -col-1">
                                <span className="table-row">BA</span>
                            </div>
                            <div className="col -col-1">
                                <span className="table-row">3/3</span>
                            </div>
                            <div className="col -col-2">
                                <i className="ss-icon-quarter"></i>
                                <i className="ss-icon-half"></i>
                                <i className="ss-icon-three-quarters"></i>
                                <i className="ss-icon-full"></i>
                            </div>
                            <div className="col -col-1">
                                <i className="ss-icon-down-arrow"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
