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
                <ul className="header-bar">
                    <li>Employee</li>
                    <li>Location</li>
                    <li>Skill Match</li>
                    <li>Allocation per week</li>
                </ul>
                <div className="results-section">
                    <ul className="result">
                        <li>
                            <div>
                                <p><strong>First Last</strong></p>
                                <p>Position</p>
                            </div>
                        </li>
                        <li>
                            <div>
                                BA
                            </div>
                        </li>
                        <li>
                            <div>
                                3/3
                            </div>
                        </li>
                        <li>
                            <div>
                                <i className="ss-icon-empty"></i>
                                <i className="ss-icon-quarter"></i>
                                <i className="ss-icon-half"></i>
                                <i className="ss-icon-three-quarters"></i>
                                <i className="ss-icon-full"></i>
                            </div>
                        </li>
                    </ul>
                    <ul className="result">
                        <li>
                            <div>
                                <p><strong>First Last</strong></p>
                                <p>Position</p>
                            </div>
                        </li>
                        <li>
                            <div>
                                BA
                            </div>
                        </li>
                        <li>
                            <div>
                                3/3
                            </div>
                        </li>
                        <li>
                            <div>
                                <i className="ss-icon-empty"></i>
                                <i className="ss-icon-quarter"></i>
                                <i className="ss-icon-half"></i>
                                <i className="ss-icon-three-quarters"></i>
                                <i className="ss-icon-full"></i>
                            </div>
                        </li>
                    </ul>
                    <ul className="result">
                        <li>
                            <div>
                                <p><strong>First Last</strong></p>
                                <p>Position</p>
                            </div>
                        </li>
                        <li>
                            <div>
                                BA
                            </div>
                        </li>
                        <li>
                            <div>
                                3/3
                            </div>
                        </li>
                        <li>
                            <div>
                                <i className="ss-icon-empty"></i>
                                <i className="ss-icon-quarter"></i>
                                <i className="ss-icon-half"></i>
                                <i className="ss-icon-three-quarters"></i>
                                <i className="ss-icon-full"></i>
                            </div>
                        </li>
                    </ul>
                    <ul className="result">
                        <li>
                            <div>
                                <p><strong>First Last</strong></p>
                                <p>Position</p>
                            </div>
                        </li>
                        <li>
                            <div>
                                BA
                            </div>
                        </li>
                        <li>
                            <div>
                                3/3
                            </div>
                        </li>
                        <li>
                            <div>
                                <i className="ss-icon-empty"></i>
                                <i className="ss-icon-quarter"></i>
                                <i className="ss-icon-half"></i>
                                <i className="ss-icon-three-quarters"></i>
                                <i className="ss-icon-full"></i>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}
