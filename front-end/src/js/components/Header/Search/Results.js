import React from "react";

import { Link } from "react-router";

export default class Results extends React.Component {

    constructor () {
      super();

      this.state = {
        isClicked: false
      };
    }

    clickingState(event, props, skill) {
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
                    {this.props.results.tools.map(function (tool, props){
                      return <li data-skill={tool} onClick={self.clickingState.bind(self, props, tool)}>{tool}</li>;
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