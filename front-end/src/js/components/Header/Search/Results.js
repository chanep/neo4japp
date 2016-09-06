import React from "react";
import ReactDom from "react-dom";

import { Link } from "react-router";

export default class Results extends React.Component {

    constructor () {
      super();

      this.state = {
        isClicked: false
      };
    }

    clickingState (event, props, skill) {
      console.log("SKillEVENT" ,event);
      console.log("SKILLPROPS" ,props);
      console.log("SKILSKILL" ,skill);
      this.props.addSkill(props);
    }

    render () {
      let self = this;
        return (
          <div className="search__results__wrapper">
          {this.props.hasResults ?
            (<div className="search__results">
              <ul>
                <li className="category-list">Skills</li>
                <li className="subcategory-list">
                  <ul>
                    {this.props.results.skills.map(function (skill, props){
                      return <li data-skill={skill} onClick={self.clickingState.bind(self, props, skill)}>{skill}</li>;
                    })}
                  </ul>
                </li>
              </ul>
              <ul>
                <li className="category-list">Tools</li>
                <li className="subcategory-list">
                  <ul>
                    {this.props.results.tools.map(function (tool){
                      return <li data-skill={tool} onClick={self.clickingState.bind(self)}>{tool}</li>;
                    })}
                  </ul>
                </li>
              </ul>
              <ul>
                <li className="category-list">People</li>
                <li className="subcategory-list">
                  <ul>
                    {this.props.results.people.map(function (person){
                      return <li>{person}</li>;
                    })}
                  </ul>
                </li>
              </ul>
            </div>) : null}
            </div>
        );
    }
}