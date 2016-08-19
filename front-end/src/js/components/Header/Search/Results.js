import React from "react";

import { Link } from "react-router";

export default class Results extends React.Component {
    render () {
        return (
          <div className="search__results__wrapper">
          {this.props.results ?
            (<div className="search__results">
              <ul>
                <li className="category-list">Skills</li>
                <li className="subcategory-list">
                  <ul>
                    <li className="selected">Node</li>
                    <li>NodeJS</li>
                  </ul>
                </li>
              </ul>
              <ul>
                <li className="category-list">Tools</li>
                <li className="subcategory-list">
                  <ul>
                    <li>Animator</li>
                  </ul>
                </li>
              </ul>
              <ul>
                <li className="category-list">People</li>
                <li className="subcategory-list">
                  <ul>
                    <li>Andrés Juarez</li>
                  </ul>
                </li>
              </ul>
            </div>) : null}
            </div>
        );
    }
}