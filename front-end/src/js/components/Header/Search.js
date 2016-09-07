import React from "react";

import Results from "./Search/Results";
import Pill from './Search/Pill';

import { Link } from "react-router";

export default class Search extends React.Component {
    constructor () {
      super();

      this.state = {
        hasResults: false,
        //source: 'http://www.mocky.io/v2/57b754560f000037100b7d36',
        query: '',
        skillArr: []
      };

      this.addSkill = this.addSkill.bind(this);
      this.removeSkill = this.removeSkill.bind(this)
    }

    updateQuery(e) {
      this.setState({ query: e.target.value });
      this.query();

      if (!this.state.hasResults) {
        this.showResults();
      }
    }

    addSkill(skill, key) {
      let currentArr = this.state.skillArr;
      currentArr.push(skill);
      this.setState({skillArr:currentArr});

      console.log("THIS>STATE>SKILLARR",this.state.skillArr); // THROWS THE UPDATED ARRAY 


    }

    removeSkill(skill, index) {
      //console.log('removido');
      let currentArr = this.state.skillArr;
      currentArr.splice(index, 1);
      this.setState({skillArr:currentArr});
      
      console.log(currentArr);

    }

    query() {
      /*var request = new XMLHttpRequest();
      request.open("POST", this.state.source, true);

      request.onreadystatechange = function () {
        console.log(request.status);
        if (request.readyState != 4 || request.status != 200) {
          return;
        }
        var data = request.responseText;*/
        
        var data = '{"skills": ["Angular", "Animations", "Google Analytics"], "tools": ["Animator"], "people": ["Andrés Juárez"]}';

        var parsedData = JSON.parse(data);
        // console.log("parsedData",parsedData);

        this.setState({ results: parsedData });

        // console.log(parsedData);

      /*};

      request.send(this.state.query);*/
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
                    <input type="text" name="query" onChange={this.updateQuery.bind(this)} />
                  </div> 
                  <span className="search-button-wrapper">
                    <span className="icon-close"><span className="path1"></span><span className="path2" onClick={this.hideResults.bind(this)}></span></span>
                    <span className="icon-search" onClick={this.showResults.bind(this)}></span>
                  </span>
                </div>
              </div>

              <div className="search-pill-wrapper">
                {pills.map((pillName, index)=>{
                  return (<Pill title={pillName} removeSkill={this.removeSkill} index={index} />)
                })}
              </div>

              { <Results hasResults={this.state.hasResults} results={this.state.results} addSkill={this.addSkill} /> }
            </div>
        );
    }
}