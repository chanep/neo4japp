import React from "react";

import Results from "./Search/Results";
import Pill from './Search/Pill';

import { Link } from "react-router";

export default class Search extends React.Component {
    constructor () {
      super();

      this.state = {
        hasResults: false,
        source: '',
        query: '',
        skillArr: []
      };

      this.addSkill = this.addSkill.bind(this)
    }

    updateQuery(e) {
      this.setState({ query: e.target.value });
      this.query();

      if (!this.state.hasResults) {
        this.showResults();
      }
    }

    addSkill(skill) {
      let currentArr = this.state.skillArr;
      currentArr.push(skill);
      this.setState({skillArr:currentArr});
    }

    query() {
      console.log("queryyy");
      this.setState({ source:'http://localhost:15005/api/resource-manager/search-all?term=ph&limit=5'});
      var request = new XMLHttpRequest();
      request.open("GET", this.state.source, true);
      request.setRequestHeader("Content-Type", "application/json;charset=UTF-8"); 

      request.onreadystatechange = function () {
        console.log(request.status);
        if (request.readyState != 4 || request.status != 200) {
          console.log("ERROR");
          return;
        }
        var data = request.responseText;
        console.log(JSON.parse(data));
         data = '{"skills": ["Angular", "Animations", "Google Analytics"], "tools": ["Animator"], "people": ["Andrés Juárez"]}';

        var parsedData = JSON.parse(data);
        console.log(parsedData);
        // console.log("parsedData",parsedData);

        this.setState({ results: parsedData });

        // console.log(parsedData);
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
        return (
            <div className="search">
              <div className="search__input__wrapper">
                <div className="search__input">
                  <div className="search-field-wrapper">
                    {pills.map(pillName=>{
                       return (<Pill title={pillName}/>)
                    })}
                   
                    <input type="text" name="query" onChange={this.updateQuery.bind(this)} />
                  </div> 
                  <span className="search-button-wrapper">
                    <span className="icon-close"><span className="path1"></span><span className="path2" onClick={this.hideResults.bind(this)}></span></span>
                    <span className="icon-search" onClick={this.showResults.bind(this)}></span>
                  </span>
                </div>
              </div>
     
            </div>
        );
    }
}