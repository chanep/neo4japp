import React from "react";

import { Link } from "react-router";

import Header from "../components/Header";

export default class ResourceHotspot extends React.Component {
    render () {
        return (
            <div>
                <Header search={true} loggedIn={true} />
                <section className="main-content">
                  <div className="two-col-wrapper resource-manager-map">
                    <div className="left-col">
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
                    <div className="right-col">
                      <h2>Resource hotspot</h2>
                      <ul className="map-wrapper">
                        <li className="ny">
                          <a href="#"><span className="location">NY</span><span className="amount">25</span></a>
                        </li>
                        <li className="lnd">
                          <a href="#"><span className="location">LND</span><span className="amount">10</span></a>
                        </li>
                        <li className="sp">
                          <a href="#"><span className="location">SP</span><span className="amount">3</span></a>
                        </li>
                        <li className="ba">
                          <a href="#"><span className="location">BA</span><span className="amount">5</span></a>
                        </li>
                        <li className="au">
                          <a href="#"><span className="location">AU</span><span className="amount">3</span></a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </section>
            </div>
        );
    }
}