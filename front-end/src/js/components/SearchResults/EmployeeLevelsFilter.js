/**
 * Components: EmployeeLevelsFilter
 */

// Dependencies
import React from 'react';

import UserServices from '../../services/UserServices';
import {gaEmployeeViewFilter} from '../../services/GoogleAnalytics';

// Class: SearchResults
export default class EmployeeLevelsFilter extends React.Component {
    constructor() {
        super();

        this.state = {
            "levels": [],
            "levelsSelected": []
        };
    }

    getLevels(levelsSelected) {
        var userServices = new UserServices();
        
        userServices.GetEmployeeLevels().then(data => {
            this.setState({
                "levels": data,
                "levelsSelected": levelsSelected
            });
        }).catch(data => {
            console.log("Error getting levels", data);
        });
    }

    componentDidMount() {
        this.getLevels(this.props.levels);
    }

    componentWillReceiveProps(nextProps) {
        this.getLevels(nextProps.levels);
    }

    handleChange(refVal, e) {
        let levelId = refVal;
        gaEmployeeViewFilter(levelId, ""+this.props.skillsCount);
        this.props.onLevelChanged(levelId);
    }

    allSelected(e) {
        this.props.allSelected();
    }

    render() {
        var self = this;

        if (this.state.levels === null)
            return null;

        return (
            <div className="filterType">
                <span className="filter-title">Levels</span> <span className="filter-title-group all-bottom" onClick={self.allSelected.bind(self)}>(All)</span>
                <ul>
                    {
                        this.state.levels.map((level) => {
                            if (level !== null) {
                                return <li key={level} className="filter-option">
                                    <label>
                                        <input type="checkbox" id={level} value={level} checked={self.state.levelsSelected.indexOf(level.toString()) !== -1} onChange={self.handleChange.bind(self, level.toString())} /> {level}
                                    </label>
                                </li>
                            }
                        })
                    }
                </ul>
            </div>
        );
    }
}
