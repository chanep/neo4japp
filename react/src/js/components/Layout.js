import React from "react";

import { Link } from "react-router";

import Header from "./Header";
import Footer from "./Footer";

export default class Layout extends React.Component {
  render () {
    return (
        <div>
            <Header />
            {this.props.children}
            <Footer />  
        </div>
    );
  }
}