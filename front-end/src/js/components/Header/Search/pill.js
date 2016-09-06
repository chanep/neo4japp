import React from "react";

import Results from "./Search/Results";

import { Link } from "react-router";

export default class Pill extends React.Component {
    constructor () {
      super();

      this.state = {
        isVisible: true
      };
    }

    removeItem () {
      this.setState({ isVisible: false });
    }


    render () {

      let pill;

      if (this.state.isVisible) {
        pill = <span className="search-field-pill">Angular <span className="search-field-pill__close" onClick={this.removeItem.bind(this)}></span></span>;
      } else {
        pill = <span></span>;
      }

        return (
            <span className="search-field-pill">Angular <span className="search-field-pill__close" onClick={this.removeItem.bind(this)}></span></span>
        );
    }
}