import React from "react";

import { Link } from "react-router";

export default class Results extends React.Component {
    render () {
        return (
          <div className="search__results__wrapper">
          {this.props.hasResults ?
            (<div className="search__results">
              <ul>
                <li className="category-list">Skills</li>
                <li className="subcategory-list">
                  <ul>
                    {this.props.results.skills.map(function (skill){
                      return <li>{skill}</li>;
                    })}
                  </ul>
                </li>
              </ul>
              <ul>
                <li className="category-list">Tools</li>
                <li className="subcategory-list">
                  <ul>
                    {this.props.results.tools.map(function (tool){
                      return <li>{tool}</li>;
                    })}
                  </ul>
                </li>
              </ul>
              <ul>
                <li className="category-list">People</li>
                <li className="subcategory-list">
                  <ul>
                    {this.props.results.people.map(function (person){
                      return <li>{person}</li>;
                    })}
                  </ul>
                </li>
              </ul>
            </div>) : null}
            </div>
        );
    }
}