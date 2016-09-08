/**
 * Components: SearchResultsTable
 */

// Dependencies
import React from 'react';
import Search from './Header/Search';

// Class: SearchResultsTable
export default class ManagerHomeTable extends React.Component {
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
                        <span className="table-header">LOUUUUUUU</span>
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
                        //Left column goes here
                    </div>
                    <div className="results col -col-9 -col-no-gutter">
                        <div className="grid">
                            <div className="col -col-5">
                                <p className="table-row-heading">Manuel Bruno Lazzaro</p>
                                <p className="table-row-small">Senior Open Standards Developer</p>
                            </div>
                            <div className="col -col-2">
                                <span className="table-row">BA</span>
                            </div>
                            <div className="col -col-1">
                                <span className="table-row">5</span>
                            </div>
                            <div className="col -col-1">
                                <i className="ss-icon-down-arrow"></i>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="col -col-5">
                                <p className="table-row-heading">First Last</p>
                                <p className="table-row-small">Position</p>
                            </div>
                            <div className="col -col-2">
                                <span className="table-row">BA</span>
                            </div>
                            <div className="col -col-1">
                                <span className="table-row">5</span>
                            </div>
                            <div className="col -col-1">
                                <i className="ss-icon-down-arrow"></i>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="col -col-5">
                                <p className="table-row-heading">First Last</p>
                                <p className="table-row-small">Position</p>
                            </div>
                            <div className="col -col-2">
                                <span className="table-row">BA</span>
                            </div>
                            <div className="col -col-1">
                                <span className="table-row">5</span>
                            </div>
                            <div className="col -col-1">
                                <i className="ss-icon-down-arrow"></i>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="col -col-5">
                                <p className="table-row-heading">First Last</p>
                                <p className="table-row-small">Position</p>
                            </div>
                            <div className="col -col-2">
                                <span className="table-row">BA</span>
                            </div>
                            <div className="col -col-1">
                                <span className="table-row">5</span>
                            </div>
                            <div className="col -col-1">
                                <i className="ss-icon-down-arrow"></i>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="col -col-5">
                                <p className="table-row-heading">First Last</p>
                                <p className="table-row-small">Position</p>
                            </div>
                            <div className="col -col-2">
                                <span className="table-row">BA</span>
                            </div>
                            <div className="col -col-1">
                                <span className="table-row">5</span>
                            </div>
                            <div className="col -col-1">
                                <i className="ss-icon-down-arrow"></i>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="col -col-5">
                                <p className="table-row-heading">First Last</p>
                                <p className="table-row-small">Position</p>
                            </div>
                            <div className="col -col-2">
                                <span className="table-row">BA</span>
                            </div>
                            <div className="col -col-1">
                                <span className="table-row">5</span>
                            </div>
                            <div className="col -col-1">
                                <i className="ss-icon-down-arrow"></i>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="col -col-5">
                                <p className="table-row-heading">First Last</p>
                                <p className="table-row-small">Position</p>
                            </div>
                            <div className="col -col-2">
                                <span className="table-row">BA</span>
                            </div>
                            <div className="col -col-1">
                                <span className="table-row">5</span>
                            </div>
                            <div className="col -col-1">
                                <i className="ss-icon-down-arrow"></i>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="col -col-5">
                                <p className="table-row-heading">First Last</p>
                                <p className="table-row-small">Position</p>
                            </div>
                            <div className="col -col-2">
                                <span className="table-row">BA</span>
                            </div>
                            <div className="col -col-1">
                                <span className="table-row">5</span>
                            </div>
                            <div className="col -col-1">
                                <i className="ss-icon-down-arrow"></i>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="col -col-5">
                                <p className="table-row-heading">First Last</p>
                                <p className="table-row-small">Position</p>
                            </div>
                            <div className="col -col-2">
                                <span className="table-row">BA</span>
                            </div>
                            <div className="col -col-1">
                                <span className="table-row">5</span>
                            </div>
                            <div className="col -col-1">
                                <i className="ss-icon-down-arrow"></i>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="col -col-5">
                                <p className="table-row-heading">First Last</p>
                                <p className="table-row-small">Position</p>
                            </div>
                            <div className="col -col-2">
                                <span className="table-row">BA</span>
                            </div>
                            <div className="col -col-1">
                                <span className="table-row">5</span>
                            </div>
                            <div className="col -col-1">
                                <i className="ss-icon-down-arrow"></i>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="col -col-5">
                                <p className="table-row-heading">First Last</p>
                                <p className="table-row-small">Position</p>
                            </div>
                            <div className="col -col-2">
                                <span className="table-row">BA</span>
                            </div>
                            <div className="col -col-1">
                                <span className="table-row">5</span>
                            </div>
                            <div className="col -col-1">
                                <i className="ss-icon-down-arrow"></i>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="col -col-5">
                                <p className="table-row-heading">First Last</p>
                                <p className="table-row-small">Position</p>
                            </div>
                            <div className="col -col-2">
                                <span className="table-row">BA</span>
                            </div>
                            <div className="col -col-1">
                                <span className="table-row">5</span>
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
