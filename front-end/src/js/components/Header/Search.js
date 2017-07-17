import React from "react";

import Results from "./Search/Results";
import Pill from './Search/Pill';
import BasePage from '../../pages/BasePage';
import SearchServices from '../../services/SearchServices';
import SkillsServices from '../../services/SkillsServices';
import UserServices from '../../services/UserServices';
import ENV from '../../../config';

import { hashHistory, Link, browserHistory, withRouter } from "react-router";

import ReactDOM from "react-dom";

class Search extends React.Component {
    constructor (props) {
      super(props);

      this.state = {
        query:'',
        //skillArr: [],
        chosenItems: [],
        results:{},
        selection: -1
      };

      this.addItem = this.addItem.bind(this);
      this.clearSearch = this.clearSearch.bind(this);
      this.removePill = this.removePill.bind(this);
      this.updateQuery = this.updateQuery.bind(this);
      this.move = this.move.bind(this);
      this.makeQuery = this.makeQuery.bind(this);
      this.addPillFromResults = this.addPillFromResults.bind(this);
      this.clearSearchField = this.clearSearchField.bind(this);
      this.closeSearch = this.closeSearch.bind(this);
      this.externalAddPill = this.externalAddPill.bind(this);
    }

    updateChosenItemsFromSearchState(searchState) {
      if(typeof searchState !== 'object') {
        //return;
      }

      var skillsServices = new SkillsServices(),
          userServices = new UserServices(),
          pillsLimit = ENV().search.pillsLimit,
          oldChosenItems = this.state.chosenItems;

      var skillsPills = searchState.skillsIds.length > 0 ? skillsServices.GetSkillsByIds(searchState.skillsIds, pillsLimit) : Promise.resolve([]),
          interestsPills = searchState.interestsIds.length > 0 ? userServices.GetInterests(searchState.interestsIds, pillsLimit) : Promise.resolve([]),
          clientsPills = searchState.clientsIds.length > 0 ? userServices.GetClientsByIds(searchState.clientsIds, pillsLimit) : Promise.resolve([]),
          chosenItems = [];

      Promise.all([skillsPills, interestsPills, clientsPills]).then(pills => {
        pills[0].forEach(function (pill) {
          chosenItems.push({
            "id": pill.id,
            "name": pill.name,
            "type": pill.group.type
          });
        });

        pills[1].forEach(function (pill) {
          chosenItems.push({
            "id": pill.id,
            "name": pill.name,
            "type": 'interest'
          });
        });

        pills[2].forEach(function (pill) {
          chosenItems.push({
            "id": pill.id,
            "name": pill.name,
            "type": 'client'
          });
        });


        var sortedChosenItems = [];

        oldChosenItems.forEach(oldChosenItem => {
          if(chosenItems.find(newChosenItem => JSON.stringify(newChosenItem) == JSON.stringify(oldChosenItem)) !== undefined) {
            sortedChosenItems.push(oldChosenItem);
            chosenItems = chosenItems.filter(newChosenItem => JSON.stringify(newChosenItem) != JSON.stringify(oldChosenItem));
          }
        });

        sortedChosenItems = sortedChosenItems.concat(chosenItems);

        this.setState({chosenItems: sortedChosenItems});
      })
    }

    componentDidMount() {
      let that = this;

      window.addEventListener('keyup', this.closeSearch, false);
      window.addEventListener('add-pill', function (e) {
        that.externalAddPill(e.detail.id, e.detail.name, e.detail.type, e.detail.redirectPath);
      }, false);

      this.updateChosenItemsFromSearchState(this.props.searchState);
    }

    componentWillReceiveProps(newProps) {
      this.updateChosenItemsFromSearchState(newProps.searchState);
    }

    closeSearch(e) {
      const ESC_KEYCODE = 27;

      if (e.keyCode == ESC_KEYCODE) {
        this.setState({ results: [], selection: -1 });
        this.clearSearchField();
      }
    }

    componentDidUpdate(){
      ReactDOM.findDOMNode(this.refs.querySearch).focus();
    }

    updateQuery(e) {
      e.preventDefault();

      this.setState({query: e.target.value});

      if (e.target.value.length > 1) {
        this.query(e.target.value);
        this.setState({ selection: -1 });
      } else {
        this.setState({ results: [], selection: -1 });
      }
    }

    clearSearchField() {
      document.getElementById('querySearch').value = "";
      this.setState({query: ''});
    }

    addItem(pillToAdd, redirectPath) {
      let searchService = new SearchServices();

      console.log(pillToAdd, redirectPath);


      if(pillToAdd.type == 'user') {
        searchService.UpdateSearchState({}, '/employee/' + pillToAdd.id);
      } else {

        let newSearchState = Object.assign({}, this.props.searchState);

        if(pillToAdd.type == 'client' && !newSearchState.clientsIds.includes(pillToAdd.id)) {
          newSearchState.clientsIds.push(pillToAdd.id);
        } else if (pillToAdd.type == 'interest' && !newSearchState.interestsIds.includes(pillToAdd.id)) {
          newSearchState.interestsIds.push(pillToAdd.id);
        } else if(!newSearchState.skillsIds.includes(pillToAdd.id)) {
          newSearchState.skillsIds.push(pillToAdd.id);
        }

        searchService.UpdateSearchState(newSearchState, redirectPath);
      }

      this.clearSearchField();
      this.setState({ results: [], selection: -1 });
    }

    removePill(skill, index) {
      let searchService = new SearchServices();
      let newSearchState = Object.assign({}, this.props.searchState);
      let pillToRemove = this.state.chosenItems[index];

      if(pillToRemove.type == 'client') {
        newSearchState.clientsIds = newSearchState.clientsIds.filter(id => id != pillToRemove.id);
      } else if (pillToRemove.type == 'interest') {
        newSearchState.interestsIds = newSearchState.interestsIds.filter(id => id != pillToRemove.id);
      } else {
        newSearchState.skillsIds = newSearchState.skillsIds.filter(id => id != pillToRemove.id);
      }

      searchService.UpdateSearchState(newSearchState, this.props.currentPathname);
    }

    query(queryString) {

      let searchService = new SearchServices(),
          that = this;

      searchService.GetSearchAll(queryString, 5).then(data =>{
         //console.log('Search new service')
         //this.setState({ results: data });

         var results = [];

         data.skills.forEach(function (skill) {
          var repeated = false;

          that.state.chosenItems.forEach(function (item) {
            if (item.id == skill.id) {
              repeated = true;
            }
          });

          if (!repeated)
            results.push({ "id": skill.id, "name": skill.name, "type": 'skill'});
         });

         data.tools.forEach(function (tool) {
          var repeated = false;

          that.state.chosenItems.forEach(function (item) {
            if (item.id == tool.id) {
              repeated = true;
            }
          });

          if (!repeated)
            results.push({ "id": tool.id, "name": tool.name, "type": 'tool'});
        });

         data.users.forEach(function (user) {
          results.push({
            "id": user.id,
            "email": user.email,
            "first": user.first,
            "name": user.fullname,
            "fullname": user.fullname,
            "last": user.last,
            "phone": user.phone,
            "phonelistId": user.phonelistId,
            "roles": user.roles,
            "sourceId": user.sourceId,
            "type": user.type,
            "username": user.username,
            "type": "user"});
         });

         data.interests.forEach(function (interest) {
          var repeated = false;

          that.state.chosenItems.forEach(function (item) {
            if (item.id == interest.id) {
              repeated = true;
            }
          });

          if (!repeated)
            results.push({ "id": interest.id, "name": interest.name, "type": 'interest'});
         });

        data.industries.forEach(function (industry) {
          var repeated = false;

          that.state.chosenItems.forEach(function (item) {
            if (item.id == industry.id) {
              repeated = true;
            }
          });

          if (!repeated)
            results.push({ "id": industry.id, "name": industry.name, "type": 'industry'});
         });

        data.clients.forEach(function (client) {
          var repeated = false;

          that.state.chosenItems.forEach(function (item) {
            if (item.id == client.id) {
              repeated = true;
            }
          });

          if (!repeated)
            results.push({ "id": client.id, "name": client.name, "type": 'client'});
         });

         this.setState({ results: results });

      }).catch(data => {
          //console.log("search data error", data);
      });




     /*let source = 'http://localhost:15005/api/resource-manager/search-all?term='+ this.state.query + '&limit=5'
      var request = new XMLHttpRequest();
      request.open("GET",source, true);
      request.withCredentials = true;

      request.onreadystatechange =  () => {
        console.log(request.status);
        if (request.readyState != 4 || request.status != 200) {
          console.log("ERROR");
          return;
        }
        var data = request.responseText;
         var parsedData = JSON.parse(data);
        console.log("DATA", parsedData.data);
        // console.log("parsedData",parsedData);

        this.setState({ results: parsedData.data });
        var l = 0;
        l += this.state.results.skills.length;
        l += this.state.results.tools.length;
        l += this.state.results.users.length;
        console.log("LENGTHHHHHH", l);
        if(this.state.results.skills.length > 0){
          this.showResults();
        }else{
          this.hideResults(0);
        }
      };

      request.send(this.state.query);*/



    }

    clearSearch() {
      this.setState({ results: [], selection: -1 });
      this.clearSearchField();

      let searchService = new SearchServices();
      searchService.UpdateSearchState({}, this.props.currentPathname);
    }

    externalAddPill(id, name, type, redirectPath) {
      this.addItem({ "id": id, "name": name, "type": type }, (redirectPath ? redirectPath : false));
    }

    addPillFromResults() {
        let query = document.getElementById('querySearch').value.trim();
        let pillToAdd = this.state.results.find(result => result.name.trim() == query.trim());

        console.log(query, this.state.results, pillToAdd);

        if(pillToAdd) {
          this.addItem(pillToAdd);
        }
    }

    move(e) {
      const BACKSPACE_KEYCODE = 8;
      const UP_KEYCODE = 38;
      const DOWN_KEYCODE = 40;
      const TAB_KEYCODE = 9;
      const ENTER_KEYCODE = 13;
      const ESC_KEYCODE = 27;

      let chosenItems = this.state.chosenItems;
      let results = this.state.results;

      var selection = this.state.selection;

      if (e.keyCode == BACKSPACE_KEYCODE) {

        this.setState({ selection: -1 });

        // Delete last pill when pressing BACKSPACE, only if there's no text in the search field

        if (document.getElementById('querySearch').value == '') {
          if (chosenItems.length == 1) {
            this.setState({ results: [], selection: -1 });
            this.clearSearch();
          }

          this.removePill('', chosenItems.length-1);
        }
      }

      if (e.keyCode == DOWN_KEYCODE || e.keyCode == UP_KEYCODE) {
        e.preventDefault();

        console.log(selection);

        // Iterate through the list

        if (e.keyCode == UP_KEYCODE) {
          if (selection > 0) {
            selection--;
          } else {
            selection = results.length - 1;
          }
        } else if (e.keyCode == DOWN_KEYCODE) {
          if (selection < results.length - 1) {
            selection++;
          } else {
            selection = 0;
          }
        }

        console.log(selection);

        this.setState({
          selection: selection
        });

        var item = "";
        if (results.length > 0) {
          item = results[selection]['name'].trim();

          results.forEach(function (v) {
            delete v.suggested
          });

          results[selection]['suggested'] = 'suggested';

          this.setState({ results: results });
        }

        document.getElementById('querySearch').value = item;
      }

      if (e.keyCode == ENTER_KEYCODE) {
        this.addPillFromResults()
      }

      if (e.keyCode == TAB_KEYCODE) {
        e.preventDefault();
        document.getElementById('querySearch').focus();

        this.addPillFromResults();
      }
    }

    makeQuery() {
      let searchService = new SearchServices();
      searchService.UpdateSearchState(this.props.searchState);
    }

    render () {

        return (
            <div className="search">
              <div className="search__input__wrapper">
                <div className="search__input">
                  <Results results={this.state.results} word={this.state.word} addItem={this.addItem} clearSearch={this.clearSearch} />
                  <div className="search-field-wrapper">
                    {this.state.chosenItems.map((pill, index)=>{
                      return (<Pill name={pill.name} key={index} removeSkill={this.removePill} index={index} />)
                    })}
                    <input type="text" name="query" ref="querySearch" id="querySearch" onChange={this.updateQuery} onKeyDown={this.move} placeholder="enter search..."/>
                  </div>
                  {(this.state.query.length > 0 || this.state.chosenItems.length > 0) &&
                    <button className="clear-button" onClick={this.clearSearch.bind(this)}>
                      <span className="ss-icon-close"><span className="path1"></span><span className="path2"></span></span>
                    </button>
                  }

                  <button className="search-button" onClick={this.makeQuery.bind(this)}>
                    <span className="ss-icon-search" ></span>
                  </button>
                </div>
              </div>
              {/*
              <div className="search-pill-wrapper">
                {pills.map((pillName, index)=>{
                  return (<Pill name={pillName} removePill={this.removePill} index={index} />)
                })}
              </div>
              */}

            </div>
        );
    }
}

Search.contextTypes = {
    router: React.PropTypes.object.isRequired
}

export default Search;
