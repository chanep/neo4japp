import React from "react";

import Results from "./Search/Results";
import Pill from './Search/Pill';

import { Link } from "react-router";

export default class Search extends React.Component {
    constructor () {
      super();

      this.state = {
        hasResults: false,
        source:'',
        query:'',
        skillArr: [],
        results:{}
      };

      this.addSkill = this.addSkill.bind(this);
      this.removeSkill = this.removeSkill.bind(this);
      this.updateQuery = this.updateQuery.bind(this);
    }

    updateQuery(e) {
      this.setState({query: e.target.value});
      this.query();

      if (!this.state.hasResults) {
        this.showResults();
      }
    }

    addSkill(skill) {
      let currentArr = this.state.skillArr;
      currentArr.push(skill.name);
      console.log("ADD SKILL ------->", skill);
      this.setState({skillArr:currentArr});
    }

    removeSkill(skill, index) {
      //console.log('removido');
      let currentArr = this.state.skillArr;
      currentArr.splice(index, 1);
      this.setState({skillArr:currentArr});

      console.log(currentArr);
    }

    query() {
      let source = 'http://localhost:15005/api/resource-manager/search-all?term='+ this.state.query + '&limit=5'
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

      request.send(this.state.query);
    }

    hideResults() {
      this.setState({ hasResults: false });
    }

    showResults () {
      this.setState({ hasResults: true });
    }

    render () {
      var pills = this.state.skillArr;
      var self = this;
        return (
            <div className="search">
              <div className="search__input__wrapper">
                <div className="search__input">
                  <div className="search-field-wrapper">
                    <input type="text" name="query" onChange={this.updateQuery} />
                  </div> 
                  <span className="search-button-wrapper">
                    <span className="ss-icon-close"><span className="path1"></span><span className="path2" onClick={this.hideResults.bind(this)}></span></span>
                    <span className="ss-icon-search" onClick={this.showResults.bind(this)}></span>
                  </span>
                </div>
              </div>
              <div className="search-pill-wrapper">
                {pills.map((pillName, index)=>{
                  return (<Pill name={pillName} removeSkill={this.removeSkill} index={index} />)
                })}
              </div>
                 { <Results hasResults={this.state.hasResults} results={this.state.results} addSkill={this.addSkill} /> }
            </div>
        );
    }
}