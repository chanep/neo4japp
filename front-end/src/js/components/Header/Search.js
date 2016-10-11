import React from "react";

import Results from "./Search/Results";
import Pill from './Search/Pill';
import SearchServices from '../../services/SearchServices';

import { hashHistory, Link, browserHistory, withRouter } from "react-router";

class Search extends React.Component {
    constructor () {
      super();

      this.state = {
        hasResults: false,
        source:'',
        query:'',
        //skillArr: [],
        chosenItems: [],
        results:{},
        selection: 1
      };

      this.addItem = this.addItem.bind(this);
      this.removeSkill = this.removeSkill.bind(this);
      this.updateQuery = this.updateQuery.bind(this);
      this.move = this.move.bind(this);
      this.makeQuery = this.makeQuery.bind(this);
      this.addPill = this.addPill.bind(this);
      this.clearSearchField = this.clearSearchField.bind(this);
    }

    updateQuery(e) {

      if (e.target.value.length > 0) {
        this.setState({query: e.target.value});
        this.query();
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
    }

    query() {

      let searchService = new SearchServices();
      searchService.GetSearchAll(this.state.query, 5).then(data =>{
         //console.log('Search new service')
         this.setState({ results: data });
         //console.log(data);

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
            name, id, repeated = false;

        for (var i = 0; i < results.tools.length; i++) {
          var element = results.tools[i];

          if (element.name.trim().toLowerCase() == query.trim().toLowerCase()) {
            name = element.name; // Copy to mantain letter case
            id = element.id;
            valid = true;

            break; // No need to keep looking
          }
        }

        if (valid) {
          chosenItems.forEach(function (v) {
            if (v.id == id || v.name == name) {
              repeated = true;
            }
          });

          if (!repeated) {
            // Add pill only if its a valid item and it has not been added already
            chosenItems.push({ id: id, name: name });

            results.tools.forEach(function (v) { delete v.suggested });

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

      if (e.keyCode == BACKSPACE_KEYCODE) {

        // Delete last pill when pressing BACKSPACE, only if there's no text in the search field

        if (document.getElementById('querySearch').value == '') {
          chosenItems.pop();

          if (chosenItems.length == 0) {
            this.setState({ results: { skills: [], tools: [], users: [] } });
            this.setState({ selection: 1 });
            this.clearSearch();
          }

          this.setState({ chosenItems: chosenItems });
        }
      }

      if (e.keyCode == DOWN_KEYCODE || e.keyCode == UP_KEYCODE) {
        e.preventDefault();

        // Iterate through the list

        if (e.keyCode == UP_KEYCODE) {
          if (this.state.selection > 0) {
            this.state.selection--;
          } else {
            this.state.selection = results.tools.length - 1;
          }
        } else if (e.keyCode == DOWN_KEYCODE) {
          if (this.state.selection < results.tools.length - 1) {
            this.state.selection++;
          } else {
            this.state.selection = 0;
          }
        }

        var item = results.tools[this.state.selection]['name'].trim().toLowerCase();

        var index = -1;

        chosenItems.some(function(element, i) {
          if (item === element.name.trim().toLowerCase()) {
              index = i;

              return true;
          }
        });

        if (index == -1) {
          results.tools.forEach(function (v) { delete v.suggested });

          results.tools[this.state.selection]['suggested'] = 'suggested';
          this.setState({ results: results });
          document.getElementById('querySearch').value = item;
        }
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
          ids = [], idsConcat, path, i;

      for (i = 0; i < chosenItems.length; i++) {
          ids.push(chosenItems[i].id);
      }

      idsConcat = ids.join();

      path = '/searchResults/' + idsConcat;
      this.context.router.push({ pathname: path });

      this.state.hasResults = false;
      this.clearSearch();
    }

    render () {
      var pills = [],
          chosenItems = this.state.chosenItems;

      chosenItems.forEach(function (v) {
        pills.push(v.name);
      });

      var self = this;
        return (
            <div className="search">
              <div className="search__input__wrapper">
                <div className="search__input">
                  { <Results hasResults={this.state.hasResults} results={this.state.results} word={this.state.word} addItem={this.addItem} /> }
                  <div className="search-field-wrapper">
                    {pills.map((pillName, index)=>{
                      return (<Pill name={pillName} removeSkill={this.removeSkill} index={index} />)
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