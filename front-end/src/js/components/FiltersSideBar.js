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

    handleChange(refVal, e) {
        let locationId = refVal;

        this.props.onLocationsChanged(locationId);
    }

    render() {
        var self = this;

        return (
            <div className="filters col -col-3 -col-no-gutter">          	
                <div className="filterContent">
                    <span className="filter-title">Locations</span> <span className="filter-title-group">(All)</span>
                    <ul>
                        {
                            this.state.offices.map((office) => {
                                return <li key={office.id} className="filter-option">
                                    <label>
                                        <input type="checkbox" id={office.id} value={office.id} defaultChecked={self.props.locations.indexOf(office.id.toString()) != -1} onChange={self.handleChange.bind(self, office.id.toString())} /> {office.name}
                                    </label>
                                </li>
                            })
                        }
                    </ul>
                </div>
            </div>
        );
    }
}
