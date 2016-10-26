/**
 * Components: SearchAllSkillsTable
 */

// Dependencies
import React from 'react';
import Search from './Header/Search';
import SkillsLevelTable from "../components/SkillsLevelTable";
import AddSkillsFilter from "../components/EmployeeProfile/AddSkillsFilter";
import SkillsServices from "../services/SkillsServices";

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
                    <div className="col -col-4">
                        <span className="table-header">Category</span> 
                    </div>
                    <div className="col -col-3">
                        <span className="table-header">Group</span>
                    </div>
                    <div className="col -col-2">
                        <span className="table-header">Skill</span>
                    </div>
                </div>
                <div className="results-section">

                    {/*FILTERS SIDE BAR*/}
                    <AddSkillsFilter data={this.state.data} onSelectedGroup={this.handleFilter.bind(this)} />

                    <div className="results-profile results results--right col -col-9 -col-no-gutter">
                        <div className="grid">
                            <div className="col -col-5">
                                <p className="table-row-heading">PHP</p>
                            </div>
                            <div className="col -col-4">
                                <p className="table-row">Technology</p>
                            </div>
                            <div className="col -col-2">
                                <span className="table-row">5</span>
                            </div>
                            <div className={this.state.showLevels ? "col -col-1 results-arrow-open-close skill-opened" : "col -col-1 results-arrow-open-close"} onClick={this.showHideLevels.bind(this)}>
                                <i className="ss-icon-down-arrow"></i>
                            </div>
                        </div>
                        { this.state.showLevels ? <SkillsLevelTable /> : null }

                        <div className="grid">
                            <div className="col -col-5">
                                <p className="table-row-heading">PHP</p>
                            </div>
                            <div className="col -col-4">
                                <p className="table-row">Technology</p>
                            </div>
                            <div className="col -col-2">
                                <span className="table-row">5</span>
                            </div>
                            <div className="col -col-1 results-arrow-open-close">
                                <i className="ss-icon-down-arrow"></i>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="col -col-5">
                                <p className="table-row-heading">PHP</p>
                            </div>
                            <div className="col -col-4">
                                <p className="table-row">Technology</p>
                            </div>
                            <div className="col -col-2">
                                <span className="table-row">5</span>
                            </div>
                            <div className="col -col-1 results-arrow-open-close">
                                <i className="ss-icon-down-arrow"></i>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="col -col-5">
                                <p className="table-row-heading">PHP</p>
                            </div>
                            <div className="col -col-4">
                                <p className="table-row">Technology</p>
                            </div>
                            <div className="col -col-2">
                                <span className="table-row">5</span>
                            </div>
                            <div className="col -col-1 results-arrow-open-close">
                                <i className="ss-icon-down-arrow"></i>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="col -col-5">
                                <p className="table-row-heading">PHP</p>
                            </div>
                            <div className="col -col-4">
                                <p className="table-row">Technology</p>
                            </div>
                            <div className="col -col-2">
                                <span className="table-row">5</span>
                            </div>
                            <div className="col -col-1 results-arrow-open-close">
                                <i className="ss-icon-down-arrow"></i>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="col -col-5">
                                <p className="table-row-heading">PHP</p>
                            </div>
                            <div className="col -col-4">
                                <p className="table-row">Technology</p>
                            </div>
                            <div className="col -col-2">
                                <span className="table-row">5</span>
                            </div>
                            <div className="col -col-1 results-arrow-open-close">
                                <i className="ss-icon-down-arrow"></i>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="col -col-5">
                                <p className="table-row-heading">PHP</p>
                            </div>
                            <div className="col -col-4">
                                <p className="table-row">Technology</p>
                            </div>
                            <div className="col -col-2">
                                <span className="table-row">5</span>
                            </div>
                            <div className="col -col-1 results-arrow-open-close">
                                <i className="ss-icon-down-arrow"></i>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="col -col-5">
                                <p className="table-row-heading">PHP</p>
                            </div>
                            <div className="col -col-4">
                                <p className="table-row">Technology</p>
                            </div>
                            <div className="col -col-2">
                                <span className="table-row">5</span>
                            </div>
                            <div className="col -col-1 results-arrow-open-close">
                                <i className="ss-icon-down-arrow"></i>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="col -col-5">
                                <p className="table-row-heading">PHP</p>
                            </div>
                            <div className="col -col-4">
                                <p className="table-row">Technology</p>
                            </div>
                            <div className="col -col-2">
                                <span className="table-row">5</span>
                            </div>
                            <div className="col -col-1 results-arrow-open-close">
                                <i className="ss-icon-down-arrow"></i>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="col -col-5">
                                <p className="table-row-heading">PHP</p>
                            </div>
                            <div className="col -col-4">
                                <p className="table-row">Technology</p>
                            </div>
                            <div className="col -col-2">
                                <span className="table-row">5</span>
                            </div>
                            <div className="col -col-1 results-arrow-open-close">
                                <i className="ss-icon-down-arrow"></i>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="col -col-5">
                                <p className="table-row-heading">PHP</p>
                            </div>
                            <div className="col -col-4">
                                <p className="table-row">Technology</p>
                            </div>
                            <div className="col -col-2">
                                <span className="table-row">5</span>
                            </div>
                            <div className="col -col-1 results-arrow-open-close">
                                <i className="ss-icon-down-arrow"></i>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="col -col-5">
                                <p className="table-row-heading">PHP</p>
                            </div>
                            <div className="col -col-4">
                                <p className="table-row">Technology</p>
                            </div>
                            <div className="col -col-2">
                                <span className="table-row">5</span>
                            </div>
                            <div className="col -col-1 results-arrow-open-close">
                                <i className="ss-icon-down-arrow"></i>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="col -col-5">
                                <p className="table-row-heading">PHP</p>
                            </div>
                            <div className="col -col-4">
                                <p className="table-row">Technology</p>
                            </div>
                            <div className="col -col-2">
                                <span className="table-row">5</span>
                            </div>
                            <div className="col -col-1 results-arrow-open-close">
                                <i className="ss-icon-down-arrow"></i>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="col -col-5">
                                <p className="table-row-heading">PHP</p>
                            </div>
                            <div className="col -col-4">
                                <p className="table-row">Technology</p>
                            </div>
                            <div className="col -col-2">
                                <span className="table-row">5</span>
                            </div>
                            <div className="col -col-1 results-arrow-open-close">
                                <i className="ss-icon-down-arrow"></i>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="col -col-5">
                                <p className="table-row-heading">PHP</p>
                            </div>
                            <div className="col -col-4">
                                <p className="table-row">Technology</p>
                            </div>
                            <div className="col -col-2">
                                <span className="table-row">5</span>
                            </div>
                            <div className="col -col-1 results-arrow-open-close">
                                <i className="ss-icon-down-arrow"></i>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="col -col-5">
                                <p className="table-row-heading">PHP</p>
                            </div>
                            <div className="col -col-4">
                                <p className="table-row">Technology</p>
                            </div>
                            <div className="col -col-2">
                                <span className="table-row">5</span>
                            </div>
                            <div className="col -col-1 results-arrow-open-close">
                                <i className="ss-icon-down-arrow"></i>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="col -col-5">
                                <p className="table-row-heading">PHP</p>
                            </div>
                            <div className="col -col-4">
                                <p className="table-row">Technology</p>
                            </div>
                            <div className="col -col-2">
                                <span className="table-row">5</span>
                            </div>
                            <div className="col -col-1 results-arrow-open-close">
                                <i className="ss-icon-down-arrow"></i>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="col -col-5">
                                <p className="table-row-heading">PHP</p>
                            </div>
                            <div className="col -col-4">
                                <p className="table-row">Technology</p>
                            </div>
                            <div className="col -col-2">
                                <span className="table-row">5</span>
                            </div>
                            <div className="col -col-1 results-arrow-open-close">
                                <i className="ss-icon-down-arrow"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
