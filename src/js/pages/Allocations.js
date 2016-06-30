import React from "react";

import { Link } from "react-router";

import Header from "../components/Header";

export default class Allocations extends React.Component {
    render () {
        return (
            <div>
                <Header search={true} loggedIn={true} />
                <section className="main-content">
                    <h1>Allocations</h1>
                </section>
            </div>
        );
    }
}