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
      //console.log("SKILLPROPS" ,props); // THIS ONE TELLS THE ELEMENT THAT HAS BEEN CLICKED

      //TODO: check if ID is already in array
      console.log("CLICK-STATE E" , event);
      console.log("CLICK-STATE P", props);
      console.log("CLICK-STATE S", skill);
      this.props.addSkill(props);
    }

    render () {
      let self = this;
      let skills = this.props.results.skills;
      let tools = this.props.results.tools;
      let users = this.props.results.users;
      console.log("SKILLS", skills);
      console.log("Tools", tools);
      console.log("users", users);

        return (
          <div className="search__results__wrapper">

          {this.props.hasResults ?
            (<div className="search__results">
              <ul>
                <li className="category-list">Skills</li>
                <li className="subcategory-list">
                  <ul>
                    {skills.map(function (skill, props){
                      return <li data-skill={skill.name} key={skill.id} onClick={self.clickingState.bind(self, props, skill)}>{skill.name}</li>;
                    })}
                  </ul>
                </li>
              </ul>
              <ul>
                <li className="category-list">Tools</li>
                <li className="subcategory-list">
                  <ul>
                    {tools.map(function (tool, props){
                      return <li data-skill={tool.name} key={tool.id} onClick={self.clickingState.bind(self, props, tool)}>{tool.name}</li>;
                    })}
                  </ul>
                </li>
              </ul>
              <ul>
                <li className="category-list">People</li>
                <li className="subcategory-list">
                  <ul>
                    {users.map(function (person){
                      return <li>{person.name}</li>;
                    })}
                  </ul>
                </li>
              </ul>
            </div>) : null}
            </div>
        );
    }
}