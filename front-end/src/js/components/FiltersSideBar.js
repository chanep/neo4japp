/**
 * Components: FiltersSideBar
 */

// Dependencies
import React from 'react';

// Class: SearchResults
export default class FiltersSideBar extends React.Component {
    render() {
        return (
            <div className="filters col -col-3">
            	<div className="filters-search-container">
            		<span className="ss-icon-search"></span>
            		<input type="text" className="filters-search-container__field" />
            	</div>
            	
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
                    <span className="filter-title">Tools</span> <span className="filter-title-group">(All)</span>
                    <ul>
                        <li className="filter-option">
                            <label>
                                <input type="checkbox" /> Design
                            </label>
                        </li>
                        <li className="filter-option">
                            <label>
                                <input type="checkbox" /> Technology
                            </label>
                        </li>
                        <li className="filter-option">
                            <label>
                                <input type="checkbox" /> Other
                            </label>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}
