/**
 * Components: ManagerHomeTable
 */

// Dependencies
import React from 'react';
import Search from './Header/Search';
import MyTeamTable from './ManagerHome/MyTeamTable';
import UserServices from '../services/UserServices';

// Class: ManagerHomeTable
export default class ManagerHomeTable extends React.Component {
    constructor() {
        super();
        this.userServices = new UserServices();

        this.state = {
            data: null
        }
    }

    componentDidMount() {
        this.setState({loading: true});

        this.userServices.GetMyTeam().then(data => {
            let skillsValidations = 0;
            let userToValidate = 0;

            data.forEach(function(employee) {
                skillsValidations += employee.totalPendingApproval;

                if (employee.totalPendingApproval > 0) {
                    userToValidate++;
                }
            });

            this.setState({
                data: data,
                skillsValidations: skillsValidations,
                userToValidate: userToValidate,
                loading: false
            });
        }).catch(err => {
            console.log("Error retrieving my team", err);
        })
    }

    render() {
        if (this.state.loading)
            return <div className="search-results-table"><div className="loading-data-note"><span>loading data...</span></div></div>

        if (this.state.data === null)
            return <div />

        return (
            <div className="search-results-table">
                <div className="manager-notifications col -col-3">
                    {
                        this.state.skillsValidations > 0?
                            <h1 className="manager-notifications__status">{"You have " + this.state.skillsValidations + " skill/s validation requests from " + this.state.userToValidate + " member/s of your team"}</h1>
                        : null
                    }
                    
                    <p className="manager-notifications__subtitle">My Team</p>
                    <div className="manager-notifications__employee">
                        <span className="manager-notifications-icon">
                            <span className="ss-icon-employee"></span>
                        </span>
                        <div className="manager-notifications-qty">
                            <h3>{this.state.data.length}</h3>
                            <p>Employees</p>
                        </div>
                    </div>
                </div>
                <MyTeamTable myTeam={this.state.data} />
            </div>
        );
    }
}
