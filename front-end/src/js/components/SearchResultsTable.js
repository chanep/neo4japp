/**
 * Components: SearchResultsTable
 */

// Dependencies
import React from 'react';
import Search from './Header/Search';
import FiltersSideBar from '../components/FiltersSideBar';

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

                    {/*FILTERS SIDE BAR*/}
                    <FiltersSideBar /> 

                    <ul className="results col -col-9 -col-no-gutter">
                        <li className="-expanded">
                            <div className="header grid">
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
                            <div className="content grid">
                                <div className="col -col-9 manager">
                                    <span>Manager: <strong>Mauro Gonzalez</strong></span>
                                </div>
                                <ul className="skills grid">
                                    <li className="col -col-4">
                                        <div className="title">
                                            <span>Angular</span>
                                        </div>
                                        <div className="proficiency">
                                            <span>4. Can teach / manage others</span>
                                        </div>
                                        <div className="skill-bar">
                                            <div className="bar"></div>
                                            <div className="bar"></div>
                                            <div className="bar"></div>
                                            <div className="bar"></div>
                                        </div>
                                    </li>
                                    <li className="col -col-4">
                                        <div className="title">
                                            <span>Responsive</span>
                                        </div>
                                        <div className="proficiency">
                                            <span>4. Can teach / manage others</span>
                                        </div>
                                        <div className="skill-bar">
                                            <div className="bar"></div>
                                            <div className="bar"></div>
                                            <div className="bar"></div>
                                            <div className="bar"></div>
                                        </div>
                                    </li>
                                    <li className="col -col-4">
                                        <div className="title">
                                            <span>Responsive</span>
                                        </div>
                                        <div className="proficiency">
                                            <span>4. Can teach / manage others</span>
                                        </div>
                                        <div className="skill-bar">
                                            <div className="bar"></div>
                                            <div className="bar"></div>
                                            <div className="bar"></div>
                                            <div className="bar"></div>
                                        </div>
                                    </li>
                                </ul>
                                <div className="samples grid">
                                    <div className="col -col-8">
                                        <span>View work samples &gt;</span>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div className="header grid">
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
                                    <i className="ss-icon-empty"></i>
                                    <i className="ss-icon-quarter"></i>
                                    <i className="ss-icon-half"></i>
                                    <i className="ss-icon-three-quarters"></i>
                                </div>
                                <div className="col -col-1">
                                    <i className="ss-icon-down-arrow"></i>
                                </div>
                            </div>
                            <div className="content grid">
                                <div className="col -col-9 manager">
                                    <span>Manager: <strong>First last</strong></span>
                                </div>
                                <ul className="skills grid">
                                    <li className="col -col-4">
                                        <div className="title">
                                            <span>Skill</span>
                                        </div>
                                        <div className="proficiency">
                                            <span>1. Proficiency</span>
                                        </div>
                                        <div className="skill-bar">
                                            <div className="bar"></div>
                                            <div className="bar"></div>
                                            <div className="bar"></div>
                                            <div className="bar"></div>
                                        </div>
                                    </li>
                                    <li className="col -col-4">
                                        <div className="title">
                                            <span>Skill</span>
                                        </div>
                                        <div className="proficiency">
                                            <span>1. Proficiency</span>
                                        </div>
                                        <div className="skill-bar">
                                            <div className="bar"></div>
                                            <div className="bar"></div>
                                            <div className="bar"></div>
                                            <div className="bar"></div>
                                        </div>
                                    </li>
                                    <li className="col -col-4">
                                        <div className="title">
                                            <span>Skill</span>
                                        </div>
                                        <div className="proficiency">
                                            <span>1. Proficiency</span>
                                        </div>
                                        <div className="skill-bar">
                                            <div className="bar"></div>
                                            <div className="bar"></div>
                                            <div className="bar"></div>
                                            <div className="bar"></div>
                                        </div>
                                    </li>
                                </ul>
                                <div className="samples grid">
                                    <div className="col -col-8">
                                        <span>View work samples &gt;</span>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div className="header grid">
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
                                    <i className="ss-icon-empty"></i>
                                    <i className="ss-icon-quarter"></i>
                                    <i className="ss-icon-half"></i>
                                    <i className="ss-icon-three-quarters"></i>
                                </div>
                                <div className="col -col-1">
                                    <i className="ss-icon-down-arrow"></i>
                                </div>
                            </div>
                            <div className="content grid">
                                <div className="col -col-9 manager">
                                    <span>Manager: <strong>First last</strong></span>
                                </div>
                                <ul className="skills grid">
                                    <li className="col -col-4">
                                        <div className="title">
                                            <span>Skill</span>
                                        </div>
                                        <div className="proficiency">
                                            <span>1. Proficiency</span>
                                        </div>
                                        <div className="skill-bar">
                                            <div className="bar"></div>
                                            <div className="bar"></div>
                                            <div className="bar"></div>
                                            <div className="bar"></div>
                                        </div>
                                    </li>
                                    <li className="col -col-4">
                                        <div className="title">
                                            <span>Skill</span>
                                        </div>
                                        <div className="proficiency">
                                            <span>1. Proficiency</span>
                                        </div>
                                        <div className="skill-bar">
                                            <div className="bar"></div>
                                            <div className="bar"></div>
                                            <div className="bar"></div>
                                            <div className="bar"></div>
                                        </div>
                                    </li>
                                    <li className="col -col-4">
                                        <div className="title">
                                            <span>Skill</span>
                                        </div>
                                        <div className="proficiency">
                                            <span>1. Proficiency</span>
                                        </div>
                                        <div className="skill-bar">
                                            <div className="bar"></div>
                                            <div className="bar"></div>
                                            <div className="bar"></div>
                                            <div className="bar"></div>
                                        </div>
                                    </li>
                                </ul>
                                <div className="samples grid">
                                    <div className="col -col-8">
                                        <span>View work samples &gt;</span>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}
