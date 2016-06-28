import React from "react";

import { Link } from "react-router";

import Header from "../components/Header";

export default class MainContent extends React.Component {
    render () {
        return (
            <div>
                <Header search={false} loggedIn={true} />
                <section className="main-content">
                    <h1>Main content</h1>
                </section>
            </div>
        );
    }
}