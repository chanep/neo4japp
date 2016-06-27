import React from "react";

export default class Header extends React.Component {
    render () {
        return (
            <header>
              <div class="header-wrapper">
                <h1><img src="img/rga-logo.png"></img></h1>
                <a href="#" class="allocations-btn"><span class="icon-view"></span>View Allocations <img src="img/profile-pic.png"></img></a>
              </div>
              <div class="search-wrapper">
                <div class="search-wrapper__container">
                  <input type="text"/>
                  <a href="#" class="search-button-wrapper">
                    <span class="icon-close"><span class="path1"></span><span class="path2"></span></span>
                    <span class="icon-search"></span>
                  </a>
                </div>
                <div class="search-wrapper__results">
                  <ul>
                    <li class="category-list">Skills</li>
                    <li class="subcategory-list">
                      <ul>
                        <li class="selected">Node</li>
                        <li>NodeJS</li>
                      </ul>
                    </li>
                  </ul>
                  <ul>
                    <li class="category-list">Tools</li>
                    <li class="subcategory-list">
                      <ul>
                        <li>Animator</li>
                      </ul>
                    </li>
                  </ul>
                  <ul>
                    <li class="category-list">People</li>
                    <li class="subcategory-list">
                      <ul>
                        <li>Andrés Juarez</li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>
            </header>
        );
    }
}