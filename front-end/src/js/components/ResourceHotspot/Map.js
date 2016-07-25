import React from "react";

import { Link } from "react-router";

export default class Map extends React.Component {
    render () {
        return (
            <div>
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
        );
    }
}