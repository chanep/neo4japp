import React from "react";

import Results from "./Search/Results";
import Pill from './Search/Pill';
import SearchServices from '../../services/SearchServices';
import SkillsServices from '../../services/SkillsServices';

import { hashHistory, Link, browserHistory, withRouter } from "react-router";

class Search extends React.Component {
    constructor (props) {
      super(props);

      var chosenItems = [],
        skillsIds = [],
          that = this,
          limit = 1000,
          key,
          skillsServices = new SkillsServices();

      if (this.props.skillsIds != undefined &&
        this.props.skillsIds.length > 0) {

        for (var k in this.props.skillsIds) {
          if (this.props.skillsIds.hasOwnProperty(k)) {
            skillsIds.push(this.props.skillsIds[k]);
          }
        }

        skillsServices.GetSkill(limit).then(data =>{
          data.forEach(function (v) {
            if (skillsIds.indexOf(v.id.toString()) != -1) {
              chosenItems.push({ 
                "id": v.id, 
                "name": v.name, 
                "type": v.group.type 
              });
            }
          });

          this.forceUpdate();
        });
      }

      this.state = {
        hasResults: false,
        source:'',
        query:'',
        //skillArr: [],
        chosenItems: chosenItems,
        results:{},
        selection: 0,
        pointerDirty: false
      };

      this.addItem = this.addItem.bind(this);
      this.clearSearch = this.clearSearch.bind(this);
      this.removeSkill = this.removeSkill.bind(this);
      this.updateQuery = this.updateQuery.bind(this);
      this.move = this.move.bind(this);
      this.makeQuery = this.makeQuery.bind(this);
      this.addPill = this.addPill.bind(this);
      this.clearSearchField = this.clearSearchField.bind(this);
    }

    updateQuery(e) {
      e.preventDefault();

      if (e.target.value.length > 0) {
        this.setState({query: e.target.value});
        this.query(e.target.value);
         this.setState({ word: e.target.value });
        this.setState({ selection: 1 });
      
      } else if (e.target.value.length == 0) {
        this.hideResults(0);
      }

      if (!this.state.hasResults) {
        this.showResults();
      }
    }

    clearSearchField() {
      document.getElementById('querySearch').value = "";
    }

    addItem(item) {
      let currentChosenItems = this.state.chosenItems;

      var repeated = false;

      currentChosenItems.forEach(function (v) {
        if (v.id == item.id) {
          repeated = true;
        }
      });

      if (!repeated) {
        currentChosenItems.push(item);
      }

      this.clearSearchField();
      this.setState({ chosenItems: currentChosenItems });
    }

    removeSkill(skill, index) {
      let currentChosenItems = this.state.chosenItems;
      currentChosenItems.splice(index, 1);
      this.setState({ chosenItems: currentChosenItems });

      if (currentChosenItems.length == 0) {
          this.setState({ results: [] });
          this.setState({ pointerDirty: false });
          this.clearSearch();
      }
    }

    query(queryString) {

      let searchService = new SearchServices();
      searchService.GetSearchAll(queryString, 5).then(data =>{
         //console.log('Search new service')
         //this.setState({ results: data });

         var results = [];

         data.skills.forEach(function (skill) {
          results.push({ "id": skill.id, "name": skill.name, "type": 'skill'});
         });

         data.tools.forEach(function (tool) {
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

    

    hideResults() {
      this.setState({ hasResults: false });
    }

    clearSearch() {
      this.hideResults();
      this.clearSearchField();
      this.setState({ chosenItems: []});
    }

    addPill(chosenItems) {
        // Choose item
        let query = document.getElementById('querySearch').value.trim();

        var valid = false,
            results = this.state.results,
            chosenItems = this.state.chosenItems,
            name, id, type, repeated = false;

        for (var i = 0; i < results.length; i++) {
          var element = results[i];

          if (element.name.trim().toLowerCase() == query.trim().toLowerCase()) {
            name = element.name; // Copy to mantain letter case
            id = element.id;
            type = element.type;
            valid = true;

            break; // No need to keep looking
          }
        }

        if (valid) {
          chosenItems.forEach(function (v) {
            if (v.id == id || v.name == name) {
              repeated = true;
            }

            if (v.type == 'user') {
              path = '/employee/' + v.id;
              this.context.router.push({ pathname: path });
              this.state.hasResults = false;
              this.clearSearch();
            }
          });

          if (!repeated) {
            // Add pill only if its a valid item and it has not been added already
            chosenItems.push({ "id": id, "name": name, "type": type });

            results.forEach(function (v) { delete v.suggested });

            this.setState({ pointerDirty: false });
            this.setState({ chosenItems: chosenItems });
            this.setState({ results: results });

            this.clearSearchField();
          }
        }
    }

    move(e) {
      const BACKSPACE_KEYCODE = 8;
      const UP_KEYCODE = 38;
      const DOWN_KEYCODE = 40;
      const TAB_KEYCODE = 9;
      const ENTER_KEYCODE = 13;

      let chosenItems = this.state.chosenItems;
      let results = this.state.results;

      var selection = this.state.selection,
          pointerDirty = this.state.pointerDirty;

      if (e.keyCode == BACKSPACE_KEYCODE) {

        this.setState({ selection: 0 });
        this.setState({ pointerDirty: false });

        // Delete last pill when pressing BACKSPACE, only if there's no text in the search field

        if (document.getElementById('querySearch').value == '') {
          chosenItems.pop();

          if (chosenItems.length == 0) {
            this.setState({ results: [] });
            this.clearSearch();
          }

          this.setState({ chosenItems: chosenItems });
        }
      }

      if (e.keyCode == DOWN_KEYCODE || e.keyCode == UP_KEYCODE) {
        e.preventDefault();

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

        if (this.state.pointerDirty == false) {
          selection = 0;
          pointerDirty = true;
        }

        this.setState({
          selection: selection,
          pointerDirty: pointerDirty
        });

        var item = results[selection]['name'].trim().toLowerCase();

        results.forEach(function (v) {
          delete v.suggested
        });

        results[selection]['suggested'] = 'suggested';
        this.setState({ results: results });
        document.getElementById('querySearch').value = item;
      }

      if (e.keyCode == ENTER_KEYCODE) {
        this.addPill(chosenItems);

        this.makeQuery();
      }

      if (e.keyCode == TAB_KEYCODE) {
        e.preventDefault();
        document.getElementById('querySearch').focus();

        this.addPill(chosenItems);
      }
    }

    showResults () {
      this.setState({ hasResults: true });
    }

    makeQuery() {
      var chosenItems = this.state.chosenItems,
          ids = [], idsConcat, path, i,
          hasUsers = false;

      for (i = 0; i < chosenItems.length; i++) {
          ids.push(chosenItems[i].id);

          if (chosenItems[i].type == 'user') {
            path = '/employee/' + chosenItems[i].id;
            hasUsers = true;
            this.context.router.push({ pathname: path });
          }
      }

      if (!hasUsers) {
        idsConcat = ids.join();

        path = '/searchresults/' + idsConcat;
        this.context.router.push({ pathname: path });
      }

      this.state.hasResults = false;
      this.hideResults();
    }

    render () {
      var pills = [],
          chosenItems = this.state.chosenItems, i = 0;

      chosenItems.forEach(function (v) {
        pills[i] = v.name;
        i++;
      });

      var self = this;
        return (
            <div className="search">
              <div className="search__input__wrapper">
                <div className="search__input">
                  { <Results hasResults={this.state.hasResults} results={this.state.results} word={this.state.word} addItem={this.addItem} clearSearch={this.clearSearch} /> }
                  <div className="search-field-wrapper">
                    {pills.map((pillName, index)=>{
                      return (<Pill name={pillName} key={index} removeSkill={this.removeSkill} index={index} />)
                    })}
                    <input type="text" name="query" id="querySearch" onChange={this.updateQuery} onKeyDown={this.move} placeholder="enter search..."/>
                  </div> 
                  <span className="search-button-wrapper">
                    <span className="ss-icon-close"><span className="path1"></span><span className="path2" onClick={this.clearSearch.bind(this)}></span></span>
                    <span className="ss-icon-search" onClick={this.makeQuery.bind(this)}></span>
                  </span>
                </div>
              </div>
              {/*
              <div className="search-pill-wrapper">
                {pills.map((pillName, index)=>{
                  return (<Pill name={pillName} removeSkill={this.removeSkill} index={index} />)
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