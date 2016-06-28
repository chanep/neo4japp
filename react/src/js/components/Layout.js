import React from "react";

import { Link } from "react-router";

import Footer from "./Footer";

export default class Layout extends React.Component {
  render () {
    return (
        <div>
            {this.props.children}
            <Footer />
        </div>
    );
  }
}