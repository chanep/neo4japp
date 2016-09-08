import React from "react";
import { Link } from "react-router";

export default class Pill extends React.Component {
    constructor () {
      super();

      this.state = {

      }

      this.removeItem = this.removeItem.bind(this)
    }

    removeItem () {
      console.log("Remove ITEM", this.props);

      this.props.removeSkill(this.props.title,this.props.index);
    }


    render () {
        return (
            <span className="search-field-pill" >{this.props.title}<span className="search-field-pill__close" onClick={this.removeItem.bind(this)}></span></span>
        );
    }
}