import React from "react";

import { Link } from "react-router";
import UserServices from '../../services/UserServices';
import moment from "moment";
import ENV from "../../../config.js";
import Autosuggest from 'react-autosuggest';
import BasePage from "../../pages/BasePage";
import AllocationData from '../SearchResults/AllocationData';


export default class EmployeeHeader extends React.Component {
    constructor(){
        super();

        this.userData = new UserServices();
       
        this.state = {
            interest: "",
            suggestions: [],
            suggestedInterest: "",
            industries: [],
            user: null,
            skillsCount: 0,
            addSkills: true,
            showActions: false,
            showForManagerVerification: false,
            editingInterests: false,
            editingIndustries: false,
            userIndustries: []
        }

        this.editInterests = this.editInterests.bind(this);
        this.removeInterest = this.removeInterest.bind(this);
        this.addInterest = this.addInterest.bind(this);
        this.addInterestQuery = this.addInterestQuery.bind(this);
        this.addSuggestedInterest = this.addSuggestedInterest.bind(this);
        this.toggleIndustry = this.toggleIndustry.bind(this);

        this.getSuggestionValue = this.getSuggestionValue.bind(this);
        this.getSuggestions = this.getSuggestions.bind(this);
        this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
        this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
        this.renderSuggestion = this.renderSuggestion.bind(this);
        this.onAutocompleteChange = this.onAutocompleteChange.bind(this);

        this.basePage = new BasePage();
    }


    getChild (obj,key){
        let result = Object.keys(obj).map(function(k) { return obj[key]});
        return result[0];
    }

    getUser(userId) {        
        if (userId > 0) {
            this.userData.GetUserData(userId).then(data => {
                this.setState({
                    user: data,
                    skillsCount: data.skillCount,
                    unapprovedSkillCount: data.unapprovedSkillCount
                });

                var userIndustries = [];

                if (data.industries != undefined &&
                    data.industries.length > 0) {

                    for (var k in data.industries) {
                      if (data.industries.hasOwnProperty(k)) {
                        userIndustries.push(data.industries[k].id);
                      }
                    }
                }

                this.setState({ "userIndustries": userIndustries });
            }).catch(data => {
              
                console.log("user data error", data);
              
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        this.getUser(nextProps.userId);
        this.setState({
            addSkills: nextProps.addSkills,
            showActions: nextProps.showActions,
            showForManagerVerification: nextProps.showForManagerVerification
        })
    }

    componentDidMount() {
        this.getUser(this.props.userId);
        this.setState({
            addSkills: this.props.addSkills,
            showActions: this.props.showActions,
            showForManagerVerification: this.props.showForManagerVerification
        })
    }

    editInterests() {
        this.setState({ editingInterests: true });
    }

    editIndustries() {
        this.userData.GetIndustries().then(data => {
            this.setState({ industries: data, editingIndustries: true });
        }).catch(data => {
            console.log("Error while getting industries", data);
        });
    }

    finishInterestsEdition() {
        this.setState({ editingInterests: false });
    }

    finishIndustriesEdition() {
        this.setState({ editingIndustries: false });
    }

    removeInterest(interestId) {
        var user = this.state.user;

        this.userData.RemoveInterest(interestId).then(data => {
            console.log('Interest removed successfully');

            user.interests.forEach(function (interest, index) {
                if (interest.id == interestId) {
                    user.interests.splice(index, 1);
                }
            });

            this.setState({ "user": user });
        }).catch(data => {
            console.log('Error while removing interest', data);
        });
    }

    addInterest(e) {
        e.preventDefault();

        if (this.state.interest != "") {
            this.addInterestQuery(this.state.interest);
            this.setState({ "suggestedInterest": null });
        }
    }

    addInterestQuery(interest) {
        let self = this,
            user = this.state.user;

        this.userData.AddInterest(interest).then(data => {

          user.interests.push({ "id": data.id, "name": data.name });
          self.setState({ "interest": "", "user": user });
        }).catch(data => {
            console.log('Error while adding interest', data);
        });
    }

    addSuggestedInterest() {
        this.addInterestQuery(this.state.suggestedInterest.name);
        this.setState({ "suggestedInterest": null });
    }

    toggleIndustry(industry) {
        var userIndustries = this.state.userIndustries,
            user = this.state.user,
            industryId = industry.id;

        if (this.state.userIndustries.indexOf(industryId) == -1) {
            // add industry

            this.userData.SetKnowledge(industryId, 3, false).then(data => {
                userIndustries.push(industryId);
                user.industries.push({ "id": industryId, "name": industry.name });

                this.setState({ "user": user, "userIndustries": userIndustries});
            }).catch(data => {
                console.log('Error while adding industry', data);
            });
        } else {
            this.userData.DeleteKnowledge(industryId).then(data => {

                userIndustries.splice(userIndustries.indexOf(industryId), 1);

                user.industries.forEach(function (industry, index) {
                    if (industry.id == industryId) {
                        user.industries.splice(index, 1);
                    }
                });

                this.setState({ "user": user, "userIndustries": userIndustries});
                this.forceUpdate();
            }).catch(data => {
                console.log('Error while removing industry', data);
            });
        }
    }

    /*
    Autocomplete functions
    */

    getSuggestions(value) {
        this.userData.GetInterests(value.value, ENV().interests.suggestionsNumber).then(data => {
            this.setState({ "suggestions": data });
        });
    }

    getSuggestionValue(suggestion) {
      return suggestion.name;
    }

    onSuggestionsFetchRequested(value) {
        this.getSuggestions(value);
    };

    onSuggestionsClearRequested() {
        this.setState({
            suggestions: []
        });
    };

    onAutocompleteChange(event, newValue, method) {
        this.setState({
          interest: newValue.newValue
        });
    }

    renderSuggestion(suggestion) {
      return (
        <span>{suggestion.name}</span>
      );
    }

    render () {
        var self = this;

        const { interest, suggestions } = this.state;
        const inputProps = {
          placeholder: "Interest",
          value: interest,
          onChange: this.onAutocompleteChange
        };

        if (this.state.user === null)
            return <div />

        var interestsString = "",
            interestsCount = (this.state.user.interests.length < ENV().interests.maximumListLength) ? this.state.user.interests.length : ENV().interests.maximumListLength;

        if (interestsCount > 0) {
            for (var i = 0; i < interestsCount; i++) {
                interestsString += this.state.user.interests[i].name + ", ";
            }

            interestsString = interestsString.slice(0, -2);
        }

        var industriesString = "",
            industriesCount = (this.state.user.industries.length < ENV().interests.maximumListLength) ? this.state.user.industries.length : ENV().interests.maximumListLength;

        if (industriesCount > 0) {
            for (var i = 0; i < industriesCount; i++) {
                industriesString += this.state.user.industries[i].name + ", ";
            }

            industriesString = industriesString.slice(0, -2);
        }

        //industriesString += "...";

        let position = this.state.user.position.name;
        let department = this.state.user.department.name;
        let officeLoc = this.state.user.office.name + ', ' + this.state.user.office.country;

        let clients = "No clients data available";
        if (this.state.user.clients.length > 0) {
            clients = "";
            this.state.user.clients.forEach(function(client) {
                clients += (clients !== ""? ", ": "") + client.name;
            });
        }
        return (
        	<div className="employee-header-container">
        		<div className="grid">
        			<div className="col -col-1">
                        {(this.state.user.image ?
                            <img src={this.state.user.image} className="profilePic"></img>
                            : <img src="/img/img_noPortrait.gif" className="profilePic"></img>
                        )}
        			</div>
        			<div className="col -col-9">
        				<div className="employee-name">{this.state.user.fullname}</div>
        				<div className="employee-subtitle">{position} - {department}</div>
                        <div className="employee-subtitle"><span className="subtitle-annotation">Office: </span>{officeLoc}</div>
                       
                        <div className="employee-subtitle"><span className="subtitle-annotation">Manager: </span>{this.getChild(this.state.user, "approvers").length > 0?this.getChild(this.state.user, "approvers")[0].fullname:"----"}</div>

                        {this.state.editingInterests ?
                            <div className="modal">
                                <div className="modal-header" onClick={this.finishInterestsEdition.bind(this)}>
                                    <span className="modal-close ss-icon-close"><span className="path1"></span><span className="path2"></span></span>
                                </div>
                                <div className="modal-contents">
                                    <h2>Edit interests</h2>
                                    <form onSubmit={this.addInterest.bind(this)}>
                                      <input type="submit" className="add-interest" value="Add Interest" />
                                      <Autosuggest
                                        suggestions={suggestions}
                                        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                                        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                                        getSuggestionValue={this.getSuggestionValue}
                                        renderSuggestion={this.renderSuggestion}
                                        inputProps={inputProps}
                                      />
                                    </form>
                                    <ul className="interests">
                                    {this.state.user.interests.map((interest, index)=>{
                                      return (<li className="interest" key={index}><span className="remove-interest ss-icon-remove" data-interest-id={interest.id} onClick={self.removeInterest.bind(this, interest.id)}></span> {interest.name}</li>)
                                    })}
                                    </ul>
                                </div>
                            </div>
                        : false }

                        {this.state.editingIndustries ?
                            <div className="modal">
                                <div className="modal-header" onClick={this.finishIndustriesEdition.bind(this)}>
                                    <span className="modal-close ss-icon-close"><span className="path1"></span><span className="path2"></span></span>
                                </div>
                                <div className="modal-contents">
                                    <h2>Edit industries</h2>
                                    <ul className="industries">
                                    {this.state.industries.map((industry, index)=>{
                                      return (<li className="industry" key={index}><input type="checkbox" checked={this.state.userIndustries.indexOf(industry.id) != -1} onChange={this.toggleIndustry.bind(this, industry)} /> {industry.name}</li>)
                                    })}
                                    </ul>
                                </div>
                            </div>
                        : false }

        				<div className="employee-interests">
                            {
                                this.state.showActions ?
                                    <div>
                    					<div className="interest editable-interest" onClick={this.editInterests.bind(this)}>
                                            <span className="ss-icon-heart"></span>
                                                {interestsString != ''
                                                    ? <span> {interestsString} <span className="edit"></span></span>
                                                    : <span className="no-items"> No interests <span className="edit"></span></span>
                                                }
                                        </div>
                                        <br />
                                        <div className="interest editable-interest" onClick={this.editIndustries.bind(this)}>
                    					    <div className="interest">
                                                <span className="ss-icon-industry"></span>
                                                    {industriesString != ''
                                                        ? <span> {industriesString} <span className="edit"></span></span>
                                                        : <span className="no-items"> No industries <span className="edit"></span></span>
                                                    }
                                            </div>
                    					</div>
                                    </div>
                                :
                                    <div>
                                        <div className="interest">
                                            <span className="ss-icon-heart"></span> 
                                            {interestsString != ''
                                                ? <span> {interestsString}</span>
                                                : <span className="none-available"> No interests available</span>
                                            }
                                        </div>
                                        <br />
                                        <div className="interest">
                                            <div className="interest">
                                                <span className="ss-icon-industry"></span>
                                                {industriesString != ''
                                                    ? <span> {industriesString}</span>
                                                    : <span className="none-available"> No industries available</span>
                                                }
                                            </div>
                                        </div>
                                    </div>
                            }
                            <div className="interest"><span className="ss-icon-clients"></span> {clients}</div>
        				</div>
        			</div>
        			<div className="col -col-2">
        				<div className="employee-skills-counter">
        					<div className="count">{this.state.skillsCount}</div>
        					<div className="label">Total Skills</div>
        				</div>

                        {
                            this.state.showActions?
                                this.state.addSkills?
                                    <div className="employee-skills-add">
                                        <Link to="/myprofile/myskills">ADD / REMOVE SKILLS</Link>
                                    </div>
                                    :
                                    <div className="employee-skills-add">
                                        <Link to="/myprofile">VIEW YOUR SKILLS</Link>
                                    </div>
                            : null
                        }
                        {this.state.showForManagerVerification?
                            <div className="employee-skills-add employee-skills-verify">
                                <span className="icon-alert">!</span>
                                <span className="label">VERIFY {this.state.unapprovedSkillCount} SKILLS IN TOTAL</span>
                            </div>
                        : null}

                        {
                            this.basePage.ResourceManagerLoggedIn()?
                                <AllocationData allocations={this.state.user.allocation} employeeId={this.state.user.phonelistId} />
                            : null
                        }
        				<div className="employee-skills-last-update">
                            {this.state.user.lastUpdate !== null?
                                <div>Updated: <span title={moment(this.state.user.lastUpdate).format("MM/DD/YYYY hh:mm")}>{moment(this.state.user.lastUpdate).fromNow()}</span></div>:
                                <div>Updated: <span>-</span></div>
                            }
        				</div>
        			</div>
        		</div>
        	</div>
        );
    }
}