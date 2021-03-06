import React from "react";

import { Link } from "react-router";
import UserServices from '../../services/UserServices';
import moment from "moment";
import ENV from "../../../config.js";
import Autosuggest from 'react-autosuggest';
import BasePage from "../../pages/BasePage";
import AllocationData from '../SearchResults/AllocationData';
import EmployeeHeaderLoader from './EmployeeHeaderLoader';
import AlertContainer from 'react-alert';
import ReactTooltip from 'react-tooltip'

import ReactDOM from "react-dom";

export default class EmployeeHeader extends React.Component {
    constructor(){
        super();

        this.userData = new UserServices();
       
        this.state = {
            interest: "",
            pastClient: "",
            suggestions: [],
            pastClientsSuggestions: [],
            suggestedInterest: "",
            suggestedPastClient: "",
            industries: [],
            pastClients: [],
            user: null,
            skillsCount: 0,
            addSkills: true,
            showActions: false,
            showForManagerVerification: false,
            editingInterests: false,
            editingIndustries: false,
            editingPastClients: false,
            userIndustries: [],
            remainderSent: false,
            addingInterest: false,
            addingPastClient: false
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

        this.handleIndustriesKeyDown = this.handleIndustriesKeyDown.bind(this);

        this.editPastClients = this.editPastClients.bind(this);
        this.onPastClientsAutocompleteChange = this.onPastClientsAutocompleteChange.bind(this);
        this.getPastClientsSuggestions = this.getPastClientsSuggestions.bind(this);
        this.onPastClientsSuggestionsFetchRequested = this.onPastClientsSuggestionsFetchRequested.bind(this);
        this.onPastClientsSuggestionsClearRequested = this.onPastClientsSuggestionsClearRequested.bind(this);
        this.addSuggestedPastClient = this.addSuggestedPastClient.bind(this);

        this.addPastClient = this.addPastClient.bind(this);
        this.addPastClientQuery = this.addPastClientQuery.bind(this);
        this.removeClient = this.removeClient.bind(this);

        this.basePage = new BasePage();
    }

    componentDidUpdate(){
        if (this.state.editingInterests || this.state.editingPastClients) {
            document.getElementsByClassName('react-autosuggest__input')[0].focus();
            document.getElementsByClassName('react-autosuggest__input')[0].setAttribute('maxlength', ENV().interests.maximumInterestLength);
        }

        if (this.state.editingIndustries) {
            ReactDOM.findDOMNode(this.refs.industries).focus();
        }
    }

    finishPastClientsEdition () {
        this.setState({ 'editingPastClients': false });
    }

    editPastClients () {
        this.setState({ 'editingPastClients': true });
    }

    handleIndustriesKeyDown(e) {
        const ESC_KEYCODE = 27;

        if (e.keyCode == ESC_KEYCODE) {
            this.finishIndustriesEdition();
        }
    }

    getChild (obj,key){
        let result = Object.keys(obj).map(function(k) { return obj[key]});
        return result[0];
    }

    getUser(userId) {
        this.setState({loading: true});
        if (userId > 0) {
            this.userData.GetUserData(userId).then(data => {
                this.setState({
                    loading: false,
                    user: data,
                    skillsCount: data.skillCount,
                    unapprovedSkillCount: data.unapprovedSkillCount,
                    remainderSent: false
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
        });
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
        this.setState({
            editingInterests: false,
            interest: ""
        });
    }

    finishIndustriesEdition() {
        this.setState({
            editingIndustries: false,
            pastClient: ""
        });
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

    removeClient(clientId) {
        var user = this.state.user;

        this.userData.RemoveClient(clientId).then(data => {
            console.log('Client removed successfully');

            user.clients.forEach(function (client, index) {
                if (client.id == clientId) {
                    user.clients.splice(index, 1);
                }
            });

            this.setState({ "user": user });
        }).catch(data => {
            console.log('Error while removing client', data);
        });
    }

    addInterest(e) {
        e.preventDefault();

        var alreadyAdded = false,
            that = this;

        if (this.state.interest.trim().length >= ENV().interests.minimumInterestLength) {
            this.state.user.interests.forEach(function (interest) {
                if (interest.name == that.state.interest.toLowerCase()) {
                    alreadyAdded = true;
                }
            });

            if (!alreadyAdded) {
                if (!this.state.addingInterest) {
                    this.setState({ "addingInterest": true });
                    this.addInterestQuery(this.state.interest.toLowerCase());
                    this.setState({ "suggestedInterest": null });
                }
            }
        }
    }

    addPastClient(e) {
        e.preventDefault();

        var alreadyAdded = false,
            that = this;

        if (this.state.pastClient.trim().length >= ENV().interests.minimumInterestLength) {
            this.state.user.clients.forEach(function (client) {
                if (client.name == that.state.pastClient) {
                    alreadyAdded = true;
                }
            });

            if (!alreadyAdded) {
                if (!this.state.addingPastClient) {
                    this.setState({ "addingPastClient": true });
                    this.addPastClientQuery(this.state.pastClient);
                    this.setState({ "suggestedPastClient": null });
                }
            }
        }
    }

    addInterestQuery(interest) {
        let self = this,
            user = this.state.user;

        this.userData.AddInterest(interest).then(data => {
          user.interests.push({ "id": data.id, "name": data.name });
          self.setState({
            "interest": "",
            "user": user,
            "addingInterest": false
          });
        }).catch(data => {
            console.log('Error while adding interest', data);
        });
    }

    addPastClientQuery(clientName) {
        let self = this,
            user = this.state.user;

        this.userData.AddClient(clientName).then(data => {
          user.clients.push({ "id": data.id, "name": data.name });
          self.setState({
            "pastClient": "",
            "user": user,
            "addingPastClient": false
          });
        }).catch(data => {
            console.log('Error while adding past client', data);
        });
    }

    addSuggestedInterest() {
        this.addInterestQuery(this.state.suggestedInterest.name);
        this.setState({ "suggestedInterest": null });
    }

    addSuggestedPastClient() {
        this.addPastClientQuery(this.state.suggestedPastClient.name);
        this.setState({ "suggestedPastClient": null });
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
    Past Clients autocomplete function
    */
    getPastClientsSuggestions(value) {
        var ids = [];
        this.userData.GetClients(value.value, ids, ENV().clients.suggestionsNumber).then(data => {
            this.setState({ "pastClientsSuggestions": data });
        });
    }

    /*
    Autocomplete functions
    */

    getSuggestions(value) {
        var ids = [];
        this.userData.GetInterests(value.value, ids, ENV().interests.suggestionsNumber).then(data => {
            this.setState({ "suggestions": data });
        });
    }

    getSuggestionValue(suggestion) {
      return suggestion.name;
    }

    onSuggestionsFetchRequested(value) {
        this.getSuggestions(value);
    };

    onPastClientsSuggestionsFetchRequested(value) {
        this.getPastClientsSuggestions(value);
    };

    onSuggestionsClearRequested() {
        this.setState({
            suggestions: []
        });
    };

    onPastClientsSuggestionsClearRequested() {
        this.setState({
            pastClientsSuggestions: []
        });
    };

    onAutocompleteChange(event, newValue, method) {
        this.setState({
          interest: newValue.newValue
        });
    }

    onPastClientsAutocompleteChange(event, newValue, method) {
        this.setState({
          pastClient: newValue.newValue
        });
    }

    renderSuggestion(suggestion) {
      return (
        <span>{suggestion.name}</span>
      );
    }

    showAlert(messg){
        msg.show(messg, {
            time: 3500,
            type: 'success',
            icon: <img src="/img/success-ico.png" />
        });
    }

    makeid()
    {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < 15; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    sendReminder() {
        let self = this;
        this.userData.RequestManagerApproval(this.state.user.id).then(() => {
            self.showAlert("Reminder sent");
            self.setState({remainderSent: true});
        });
    }

    render () {
        if (this.state.loading) {
            return <EmployeeHeaderLoader />
        }

        var self = this;

        const { interest, suggestions, pastClientsSuggestions, pastClient } = this.state;
        const inputProps = {
          placeholder: "Interest",
          value: interest,
          onChange: this.onAutocompleteChange
        };

        const pastClientsInputProps = {
          placeholder: "Past clients",
          value: pastClient,
          onChange: this.onPastClientsAutocompleteChange
        };

        if (this.state.user === null)
            return <div />

        var interestsString = "",
            interestsCount = this.state.user.interests.length;

        if (interestsCount > 0) {
            for (var i = 0; i < interestsCount; i++) {
                interestsString += this.state.user.interests[i].name + ", ";
            }

            interestsString = interestsString.slice(0, -2);
        }

        var industriesString = "",
            industriesCount = this.state.user.industries.length;

        if (industriesCount > 0) {
            for (var i = 0; i < industriesCount; i++) {
                industriesString += this.state.user.industries[i].name + ", ";
            }

            industriesString = industriesString.slice(0, -2);
        }

        //industriesString += "...";

        let position = this.state.user.position.name;
        let department = this.state.user.department.name;

        let officeName = this.state.user.office.name;
        if (officeName === "Bucuresti") officeName = "Bucharest";
        let officeLoc = officeName + ', ' + this.state.user.office.country;

        let clients = "No clients data available";
        if (this.state.user.clients.length > 0) {
            clients = "Clients at R/GA: ";
            this.state.user.clients.forEach(function(client) {
                if (client.phonelistId !== undefined) {
                    clients += (clients !== "Clients at R/GA: "? ", ": "") + client.name;
                }
            });
        }

        let newId = "tooltip_" + this.makeid();

        let pastClients = "";
        if (this.state.user.clients.length > 0) {
            pastClients = "";
            this.state.user.clients.forEach(function(pastClient) {
                if (pastClient.phonelistId == undefined) {
                    pastClients += (pastClients !== ""? ", ": "") + pastClient.name;
                }
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
                                    <h2>Add Interests</h2>
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


                        {this.state.editingPastClients ?
                            <div className="modal">
                                <div className="modal-header" onClick={this.finishPastClientsEdition.bind(this)}>
                                    <span className="modal-close ss-icon-close"><span className="path1"></span><span className="path2"></span></span>
                                </div>
                                <div className="modal-contents">
                                    <h2>Add non R/GA clients</h2>
                                    <h3>Add Clients from previous experience</h3>
                                    <form onSubmit={this.addPastClient.bind(this)}>
                                      <input type="submit" className="add-past-client" value="Add Client" />
                                      <Autosuggest
                                        suggestions={pastClientsSuggestions}
                                        onSuggestionsFetchRequested={this.onPastClientsSuggestionsFetchRequested}
                                        onSuggestionsClearRequested={this.onPastClientsSuggestionsClearRequested}
                                        getSuggestionValue={this.getSuggestionValue}
                                        renderSuggestion={this.renderSuggestion}
                                        inputProps={pastClientsInputProps}
                                      />
                                    </form>
                                    <ul className="past-clients">
                                    {this.state.user.clients.map((pastClient, index)=>{
                                        if (pastClient.phonelistId == undefined) {
                                            return (<li className="past-client" key={index}><span className="remove-interest ss-icon-remove" data-past-client-id={pastClient.id} onClick={self.removeClient.bind(this, pastClient.id)}></span> {pastClient.name}</li>)
                                        }
                                    })}
                                    </ul>
                                </div>
                            </div>
                        : false }




                        {this.state.editingIndustries ?
                            <div className="modal" tabIndex="0" ref="industries" onKeyDown={this.handleIndustriesKeyDown}>
                                <div className="modal-header" onClick={this.finishIndustriesEdition.bind(this)}>
                                    <span className="modal-close ss-icon-close"><span className="path1"></span><span className="path2"></span></span>
                                </div>
                                <div className="modal-contents">
                                    <h2>Add Industries</h2>
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
                            <div className="interest"><span className="ss-icon-clients"></span>
                                {clients != ''
                                    ? <span> {clients}</span>
                                    : <span className="none-available"> No clients available</span>
                                }
                            </div>
                            { this.state.showActions ?
                                <div>
                                    <div className="interest editable-interest" onClick={this.editPastClients.bind(this)}>
                                        <span className="ss-icon-clients"></span>
                                        {pastClients != ''
                                            ? <span> Past clients: {pastClients} <span className="edit"></span></span>
                                            : <span className="none-items"> Past clients: <span className="edit"></span></span>
                                        }
                                    </div>
                                </div>
                                :
                                <div className="past-clients"><span className="ss-icon-clients"></span>
                                    {pastClients != ''
                                        ? <span> Past clients: {pastClients}</span>
                                        : <span className="none-available"> No past clients available</span>
                                    }
                                </div>
                            }
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
                                        <Link to="/myprofile/myskills" >ADD / REMOVE SKILLS</Link>
                                    </div>
                                    :
                                    <div className="employee-skills-add">
                                        <Link to="/myprofile">VIEW YOUR SKILLS</Link>
                                    </div>
                            : null
                        }
                        {this.state.showForManagerVerification?
                            <div className="employee-skills-add employee-skills-verify">
                                <div className="alert">
                                    <span className="icon-alert">!</span>
                                    <span className="label">Verify {this.state.unapprovedSkillCount} Skills</span>
                                </div>
                                <div className="notes-references">
                                    <div className="note">
                                        <span className="box non-verified"></span> Skills need verification
                                        <span className="box verified"></span> Skills already verified
                                    </div>
                                </div>
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
                        {
                            this.basePage.ResourceManagerLoggedIn() && this.state.user.unapprovedSkillCount > 0?
                                this.state.remainderSent?
                                    <div className="approver-reminder-sent">
                                        <span className="ss-icon-warning"></span> <span>Reminder sent</span>
                                    </div>
                                :
                                    <div>
                                        <div className="approver-reminder" data-tip data-for={newId} onClick={this.sendReminder.bind(this)}>
                                            <span className="ss-icon-warning"></span> <span>Remind manager</span>
                                        </div>
                                        <ReactTooltip id={newId} class="tooltipFormat">Send reminder to manager to approve knowledge</ReactTooltip>
                                    </div>
                            :null
                        }
        			</div>
        		</div>
        	</div>
        );
    }
}