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
            "offices": [],
            "locationsIds": []
        };
    }

    getOffices(locations) {
        var userServices = new UserServices();
        
        userServices.GetOffice().then(data => {
            this.setState({
                "offices": data,
                "locationsIds": locations
            });
        }).catch(data => {
            console.log("Error performing search", data);
        });
    }

    componentDidMount() {
        this.getOffices(this.props.locations);
    }

    componentWillReceiveProps(nextProps) {
        this.getOffices(nextProps.locations);
    }

    handleChange(refVal, officeName, e) {
        let locationId = refVal;
        this.props.onLocationsChanged(locationId);
    }

    allSelected(e) {
        this.props.allSelected();
    }

    render() {
        var self = this;

        return (
            <div className="filterType">
                <span className="filter-title">Locations</span> <span className="filter-title-group all-bottom" onClick={self.allSelected.bind(self)}>(All)</span>
                <ul>
                    {
                        this.state.offices.map((office) => {
                            let officeName = office.name;
                            if (officeName === "Bucuresti") officeName = "Bucharest";

                            return <li key={office.id} className="filter-option">
                                <label className="searchskills-filter-clickel">
                                    <input type="checkbox" id={office.id} value={office.id} checked={self.state.locationsIds.indexOf(office.id.toString()) !== -1} onChange={self.handleChange.bind(self, office.id.toString(), officeName)} /> {officeName}
                                </label>
                            </li>
                        })
                    }
                </ul>
            </div>
        );
    }
}
