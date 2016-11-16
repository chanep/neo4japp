/**
 * Components: SearchAllSkillsTable
 */

// Dependencies
import React from 'react';
import Search from './Header/Search';
import AddSkillsFilter from "../components/EmployeeProfile/AddSkillsFilter";
import SkillsServices from "../services/SkillsServices";
import AllSkillsList from "../components/AllSkillsList/AllSkillsList";

// Class: SearchAllSkillsTable
export default class SearchAllSkillsTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            selectedGroup: 0
        };

        this.skillsServices = new SkillsServices();
    }

    handleFilter(selectedValue) {
        this.setState({selectedGroup: selectedValue});
    }

    getData() {
        this.skillsServices.GetAllSkills().then(data => {
            this.setState({
                data: data
            });
        }).catch(data => {
          
            console.log("skills data error", data);
          
        });
    }

    componentDidMount() {
        this.getData();
    }

    componentWillReceiveProps(nextProps) {
        this.getData();
    }

    render() {
        if (this.state.data === null || this.state.data.length === 0)
            return <div />

        return (
            <div className="search-results-table">
                <div className="header-bar">
                    <div className="col -col-3">
                        <span className="table-header">Filter</span>
                    </div>
                    <div className="col -col-5 col-name">
                        <span className="table-header">Name</span> 
                    </div>
                    <div className="col -col-3">
                        <span className="table-header">Category</span>
                    </div>
                    <div className="col -col-1">
                        <span className="table-header">Skills</span>
                    </div>
                </div>
                <div className="results-section">

                    {/*FILTERS SIDE BAR*/}
                    <AddSkillsFilter data={this.state.data} onSelectedGroup={this.handleFilter.bind(this)} />

                    <div className="addSkillsList col -col-9 -col-no-gutter">
                        <AllSkillsList selectedGroup={this.state.selectedGroup} data={this.state.data} />
                    </div>
                </div>
            </div>
        );
    }
}
