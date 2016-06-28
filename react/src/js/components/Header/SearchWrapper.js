import React from "react";

import { Link } from "react-router";

export default class SearchWrapper extends React.Component {
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
              <div className="search-wrapper__results">
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
              </div>
            </div>
        );
    }
}