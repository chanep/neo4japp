import React from "react";

import { Link } from "react-router";

export default class TopSearchedSkills extends React.Component {
    render () {
        return (
            <div>
              <h2>Top Searched Skills</h2>
              <ul>
                <li><a href="#" className="selected">Javascript</a></li>
                <li><a href="#">PHP</a></li>
                <li><a href="#">Sitecore</a></li>
                <li><a href="#">Java</a></li>
                <li><a href="#">Drupal</a></li>
                <li><a href="#">ASP .net</a></li>
                <li><a href="#">Objective C</a></li>
                <li><a href="#">NodeJS</a></li>
                <li><a href="#">Python</a></li>
                <li><a href="#">Angular</a></li>
              </ul>
              <a href="#" className="arrow-btn">Show all skills<span className="icon-right-arrow"></span></a>
            </div>
        );
    }
}