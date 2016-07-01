import React from "react";

import { Link } from "react-router";

import Header from "../components/Header";
import TopSearchedSkills from "../components/ResourceHotspot/TopSearchedSkills";
import Map from "../components/ResourceHotspot/Map";

export default class ResourceHotspot extends React.Component {
    render () {
        return (
            <div>
                <Header search={true} loggedIn={true} />
                <section className="main-content">
                  <div className="two-col-wrapper resource-manager-map">
                    <div className="left-col">
                     <TopSearchedSkills />
                    </div>
                    <div className="right-col">
                     <Map />
                    </div>
                  </div>
                </section>
            </div>
        );
    }
}