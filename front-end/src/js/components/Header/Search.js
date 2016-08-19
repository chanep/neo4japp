import React from "react";

import Results from "./Search/Results";

import { Link } from "react-router";

export default class Search extends React.Component {
    constructor () {
      super();
      this.state = {
        results: false
      };
    }

    hideResults() {
      this.setState({ results: false });
    }

    showResults () {
      this.setState({ results: true });
    }

    render () {
        return (
            <div className="search">
              <div className="search__input__wrapper">
                <div className="search__input">
                  <input type="text"/>
                  <span className="search-button-wrapper">
                    <span className="icon-close"><span className="path1"></span><span className="path2" onClick={this.hideResults.bind(this)}></span></span>
                    <span className="icon-search" onClick={this.showResults.bind(this)}></span>
                  </span>
                </div>
              </div>
              { <Results results={this.state.results} /> }
            </div>
        );
    }
}