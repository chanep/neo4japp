import React from "react";

import Results from "./Search/Results";
import Pill from './Search/Pill';
import SearchServices from '../../services/SearchServices';

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

      if (e.target.value.length > 2) {
        this.setState({query: e.target.value});
        this.query();
         this.setState({ word: e.target.value });
      
      } else if (e.target.value.length == 0) {
        this.hideResults(0);
      }

      if (!this.state.hasResults) {
        this.showResults();
      }
    }

    addSkill(skill) {
      let currentArr = this.state.skillArr;
      //console.log(currentArr.indexOf(skill.name));
      if (currentArr.indexOf(skill.name) == '-1') {
        currentArr.push(skill.name);
        //console.log("ADD SKILL ------->", skill);
        this.setState({skillArr:currentArr});
      }
     
    }

    removeSkill(skill, index) {
      //console.log('removido');
      let currentArr = this.state.skillArr;
      currentArr.splice(index, 1);
      this.setState({skillArr:currentArr});

      console.log(currentArr);
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
      document.getElementById('querySearch').value = "";
      this.setState({ skillArr: []});
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
                    {pills.map((pillName, index)=>{
                      return (<Pill name={pillName} removeSkill={this.removeSkill} index={index} />)
                    })}
                    <input type="text" name="query" id="querySearch" onChange={this.updateQuery} placeholder="enter search..."/>
                  </div> 
                  <span className="search-button-wrapper">
                    <span className="ss-icon-close"><span className="path1"></span><span className="path2" onClick={this.clearSearch.bind(this)}></span></span>
                    <span className="ss-icon-search" onClick={this.showResults.bind(this)}></span>
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
                 { <Results hasResults={this.state.hasResults} results={this.state.results} word={this.state.word} addSkill={this.addSkill} /> }
            </div>
        );
    }
}