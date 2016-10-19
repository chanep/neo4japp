import React from "react";

import { Link } from "react-router";

export default class Map extends React.Component {
    render () {
        return (
            <div>
              <h2>Resource hotspot</h2>
              <ul className="map-wrapper">
                <li className="ny">
                  <a href="#"><span className="amount">25</span></a>
                </li>
                <li className="lnd">
                  <a href="#"><span className="amount">10</span></a>
                </li>
                <li className="sp">
                  <a href="#"><span className="amount">3</span></a>
                </li>
                <li className="ba">
                  <a href="#"><span className="amount">5</span></a>
                </li>
                <li className="sy">
                  <a href="#"><span className="amount">3</span></a>
                </li>
                <li className="sh">
                  <a href="#"><span className="amount">2</span></a>
                </li>
                <li className="sg">
                  <a href="#"><span className="amount">3</span></a>
                </li>
                <li className="bu">
                  <a href="#"><span className="amount">3</span></a>
                </li>
                <li className="au">
                  <a href="#"><span className="amount">3</span></a>
                </li>
                <li className="ch">
                  <a href="#"><span className="amount">3</span></a>
                </li>
                <li className="la">
                  <a href="#"><span className="amount">3</span></a>
                </li>
                <li className="pl">
                  <a href="#"><span className="amount">3</span></a>
                </li>
                <li className="sf">
                  <a href="#"><span className="amount">3</span></a>
                </li>
                <li className="is">
                  <a href="#"><span className="amount">3</span></a>
                </li>
              </ul>
            </div>
        );
    }
}