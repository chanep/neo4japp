import React from "react";

import Results from "./Search/Results";

import { Link } from "react-router";

export default class Search extends React.Component {
    render () {
        return (
            <div className="search-wrapper">
              <div className="search-wrapper__container">
                <input type="text"/>
                <a href="#" className="search-button-wrapper">
                  <span className="icon-close"><span className="path1"></span><span className="path2"></span></span>
                  <span className="icon-search"></span>
                </a>
              </div>
              { this.props.results && <Results /> }
            </div>
        );
    }
}