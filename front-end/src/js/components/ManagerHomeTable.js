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
                <div className="manager-notifications filters col -col-3">
                    <h1 className="manager-notifications__status">You have 10 Skills validation requests from 3 members of your team</h1>
                    <p className="manager-notifications__subtitle">My Team</p>
                    <div className="manager-notifications__employee">
                        <span className="manager-notifications-icon">
                            <span className="ss-icon-employee"></span>
                        </span>
                        <div className="manager-notifications-qty">
                            <h3>14</h3>
                            <p>Employee</p>
                        </div>
                    </div>
                </div>
                <div className="header-bar col -col-9 -col-no-gutter">
                    <div className="col -col-6">
                        <span className="table-header">Employee</span>
                    </div>
                    <div className="col -col-2">
                        <span className="table-header">Location</span>
                    </div>
                    <div className="col -col-2">
                        <span className="table-header">Review Skills</span>
                    </div>
                    <div className="col -col-0">&nbsp;</div>
                </div>
                <div className="results-section">
                    <div className="manager-home results results--right col -col-9 -col-no-gutter">
                        <div className="grid">
                            <div className="col -col-6">
                                <p className="table-row-heading">Manuel Bruno Lazzaro</p>
                                <p className="table-row-small">Senior Open Standards Developer</p>
                            </div>
                            <div className="col -col-2">
                                <span className="table-row">BA</span>
                            </div>
                            <div className="col -col-1">
                                <span className="table-row">5<i className="validate-pending"></i></span>
                            </div>
                            <div className="col -col-1">
                                <i className="ss-icon-right-arrow right-small-arrow"></i>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="col -col-6">
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
                                <i className="ss-icon-right-arrow right-small-arrow"></i>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="col -col-6">
                                <p className="table-row-heading">First Last</p>
                                <p className="table-row-small">Position</p>
                            </div>
                            <div className="col -col-2">
                                <span className="table-row">BA</span>
                            </div>
                            <div className="col -col-1">
                                <span className="table-row">5<i className="validate-pending"></i></span>
                            </div>
                            <div className="col -col-1">
                                <i className="ss-icon-right-arrow right-small-arrow"></i>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="col -col-6">
                                <p className="table-row-heading">First Last</p>
                                <p className="table-row-small">Position</p>
                            </div>
                            <div className="col -col-2">
                                <span className="table-row">BA</span>
                            </div>
                            <div className="col -col-1">
                                <span className="table-row">5<i className="validate-pending"></i></span>
                            </div>
                            <div className="col -col-1">
                                <i className="ss-icon-right-arrow right-small-arrow"></i>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="col -col-6">
                                <p className="table-row-heading">First Last</p>
                                <p className="table-row-small">Position</p>
                            </div>
                            <div className="col -col-2">
                                <span className="table-row">BA</span>
                            </div>
                            <div className="col -col-1">
                                <span className="table-row">5<i className="validate-pending"></i></span>
                            </div>
                            <div className="col -col-1">
                                <i className="ss-icon-right-arrow right-small-arrow"></i>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="col -col-6">
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
                                <i className="ss-icon-right-arrow right-small-arrow"></i>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="col -col-6">
                                <p className="table-row-heading">First Last</p>
                                <p className="table-row-small">Position</p>
                            </div>
                            <div className="col -col-2">
                                <span className="table-row">BA</span>
                            </div>
                            <div className="col -col-1">
                                <span className="table-row">5<i className="validate-pending"></i></span>
                            </div>
                            <div className="col -col-1">
                                <i className="ss-icon-right-arrow right-small-arrow"></i>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="col -col-6">
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
                                <i className="ss-icon-right-arrow right-small-arrow"></i>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="col -col-6">
                                <p className="table-row-heading">First Last</p>
                                <p className="table-row-small">Position</p>
                            </div>
                            <div className="col -col-2">
                                <span className="table-row">BA</span>
                            </div>
                            <div className="col -col-1">
                                <span className="table-row">5<i className="validate-pending"></i></span>
                            </div>
                            <div className="col -col-1">
                                <i className="ss-icon-right-arrow right-small-arrow"></i>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="col -col-6">
                                <p className="table-row-heading">First Last</p>
                                <p className="table-row-small">Position</p>
                            </div>
                            <div className="col -col-2">
                                <span className="table-row">BA</span>
                            </div>
                            <div className="col -col-1">
                                <span className="table-row">5<i className="validate-pending"></i></span>
                            </div>
                            <div className="col -col-1">
                                <i className="ss-icon-right-arrow right-small-arrow"></i>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="col -col-6">
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
                                <i className="ss-icon-right-arrow right-small-arrow"></i>
                            </div>
                        </div>     
                    </div>
                </div>
            </div>
        );
    }
}
