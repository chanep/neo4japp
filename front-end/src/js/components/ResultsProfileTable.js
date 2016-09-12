/**
 * Components: ResultsProfileTable
 */

// Dependencies
import React from 'react';
import Search from './Header/Search';

// Class: ResultsProfileTable
export default class ResultsProfileTable extends React.Component {
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
                <div className="header-bar col -col-12 -col-no-gutter">
                    <div className="col -col-12">
                        <span className="table-header">Technology</span>
                    </div>
                </div>
                <div className="results-section">
                    <div className="results-profile results results--right col -col-12 -col-no-gutter">
                        <div className="grid">
                            <div className="col -col-10">
                                <p className="table-row-heading">PHP</p>
                            </div>
                            <div className="col -col-1">
                                <span className="table-row">5<i className="validate-pending"></i></span>
                            </div>
                            <div className="col -col-1 results-arrow-open-close">
                                <i className="ss-icon-down-arrow"></i>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="col -col-10">
                                <p className="table-row-heading">Javascript</p>
                            </div>
                            <div className="col -col-1">
                                <span className="table-row">5</span>
                            </div>
                            <div className="col -col-1 results-arrow-open-close">
                                <i className="ss-icon-down-arrow"></i>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="col -col-10">
                                <p className="table-row-heading">NodeJS</p>
                            </div>
                            <div className="col -col-1">
                                <span className="table-row">5</span>
                            </div>
                            <div className="col -col-1 results-arrow-open-close">
                                <i className="ss-icon-down-arrow"></i>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="col -col-10">
                                <p className="table-row-heading">Databases</p>
                            </div>
                            <div className="col -col-1">
                                <span className="table-row">5</span>
                            </div>
                            <div className="col -col-1 results-arrow-open-close">
                                <i className="ss-icon-down-arrow"></i>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="col -col-10">
                                <p className="table-row-heading">HTML/CSS</p>
                            </div>
                            <div className="col -col-1">
                                <span className="table-row">5</span>
                            </div>
                            <div className="col -col-1 results-arrow-open-close">
                                <i className="ss-icon-down-arrow"></i>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="col -col-10">
                                <p className="table-row-heading">Build Tools</p>
                            </div>
                            <div className="col -col-1">
                                <span className="table-row">5<i className="validate-pending"></i></span>
                            </div>
                            <div className="col -col-1 results-arrow-open-close">
                                <i className="ss-icon-down-arrow"></i>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="col -col-10">
                                <p className="table-row-heading">Integration Servers</p>
                            </div>
                            <div className="col -col-1">
                                <span className="table-row">5</span>
                            </div>
                            <div className="col -col-1 results-arrow-open-close">
                                <i className="ss-icon-down-arrow"></i>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="col -col-10">
                                <p className="table-row-heading">Other Languages</p>
                            </div>
                            <div className="col -col-1">
                                <span className="table-row">5</span>
                            </div>
                            <div className="col -col-1 results-arrow-open-close">
                                <i className="ss-icon-down-arrow"></i>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="col -col-10">
                                <p className="table-row-heading">APIs</p>
                            </div>
                            <div className="col -col-1">
                                <span className="table-row">5</span>
                            </div>
                            <div className="col -col-1 results-arrow-open-close">
                                <i className="ss-icon-down-arrow"></i>
                            </div>
                        </div> 
                    </div>
                </div>
                <div className="header-bar col -col-12 -col-no-gutter">
                    <div className="col -col-12">
                        <span className="table-header">Visual</span>
                    </div>
                </div>
                <div className="results-section">
                    <div className="results-profile results results--right col -col-12 -col-no-gutter">
                        <div className="grid">
                            <div className="col -col-10">
                                <p className="table-row-heading">Photoshop</p>
                            </div>
                            <div className="col -col-1">
                                <span className="table-row">5<i className="validate-pending"></i></span>
                            </div>
                            <div className="col -col-1 results-arrow-open-close">
                                <i className="ss-icon-down-arrow"></i>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="col -col-10">
                                <p className="table-row-heading">Sketch</p>
                            </div>
                            <div className="col -col-1">
                                <span className="table-row">5</span>
                            </div>
                            <div className="col -col-1 results-arrow-open-close">
                                <i className="ss-icon-down-arrow"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
