import React from "react";

import { Link } from "react-router";
import BasePage from './BasePage';
import Header from "../components/Header";

export default class Allocations extends BasePage {
    render () {
        return (
            <div>
                <Header search={true} results={true} loggedIn={true} />
                <section className="main-content">
                    <h1>Allocations</h1>
                </section>
            </div>
        );
    }
}