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
                            <p>First Last</p>
                            <p>Position</p>
                        </li>
                        <li>BA</li>
                        <li>3/3</li>
                        <li>
                            <i className="ss-icon-empty"></i>
                            <i className="ss-icon-quarter"></i>
                            <i className="ss-icon-half"></i>
                            <i className="ss-icon-three-quarters"></i>
                            <i className="ss-icon-full"></i>
                        </li>
                    </ul>
                    <ul className="result">
                        <li>
                            <p>First Last</p>
                            <p>Position</p>
                        </li>
                        <li>BA</li>
                        <li>3/3</li>
                        <li>
                            <i className="ss-icon-empty"></i>
                            <i className="ss-icon-quarter"></i>
                            <i className="ss-icon-half"></i>
                            <i className="ss-icon-three-quarters"></i>
                            <i className="ss-icon-full"></i>
                        </li>
                    </ul>
                    <ul className="result">
                        <li>
                            <p>First Last</p>
                            <p>Position</p>
                        </li>
                        <li>BA</li>
                        <li>3/3</li>
                        <li>
                            <i className="ss-icon-empty"></i>
                            <i className="ss-icon-quarter"></i>
                            <i className="ss-icon-half"></i>
                            <i className="ss-icon-three-quarters"></i>
                            <i className="ss-icon-full"></i>
                        </li>
                    </ul>
                    <ul className="result">
                        <li>
                            <p>First Last</p>
                            <p>Position</p>
                        </li>
                        <li>BA</li>
                        <li>3/3</li>
                        <li>
                            <i className="ss-icon-empty"></i>
                            <i className="ss-icon-quarter"></i>
                            <i className="ss-icon-half"></i>
                            <i className="ss-icon-three-quarters"></i>
                            <i className="ss-icon-full"></i>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}
