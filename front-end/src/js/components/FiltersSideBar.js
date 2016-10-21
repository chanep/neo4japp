/**
 * Components: FiltersSideBar
 */

// Dependencies
import React from 'react';

import UserServices from '../services/UserServices';

// Class: SearchResults
export default class FiltersSideBar extends React.Component {
    constructor() {
        super();

        this.state = {
            "offices": []
        };
    }

    componentDidMount() {
        var userServices = new UserServices();

        userServices.GetOffice().then(data => {
            this.setState({ "offices": data });
        }).catch(data => {
            console.log("Error performing search", data);
        });
    }

    render() {
        var self = this;

        return (
            <div className="filters col -col-3 -col-no-gutter">          	
                <div className="filterContent">
                    <span className="filter-title">Locations</span> <span className="filter-title-group">(All)</span>
                    <ul>
                        {
                            this.state.offices.map(function (office) {
                                return <li key={office.id} className="filter-option">
                                    <label>
                                        <input type="checkbox" id={office.id} checked={office.id == self.props.locations[0]} data-test={self.props.locations[0]} /> {office.name}
                                    </label>
                                </li>
                            })
                        }
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
