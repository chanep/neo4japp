import React from "react";
import ReactDom from "react-dom";

import { hashHistory, Link, browserHistory, withRouter } from "react-router";

class Results extends React.Component {

    constructor () {
      super();

      this.state = {
        isClicked: false
      };
    }

    clickingState (event, props, skill) {
      //console.log("SKILLPROPS" ,props); // THIS ONE TELLS THE ELEMENT THAT HAS BEEN CLICKED

      //TODO: check if ID is already in array
      //console.log("CLICK-STATE E" , event);
      //console.log("CLICK-STATE P", props);
      //console.log("CLICK-STATE S", skill);
      this.props.addItem(props);
    }

    showEmployee(self, props, person) {
      var path = '/employee/' + props.id;
      this.context.router.push({pathname: path});

      this.setState({ results: [] });
      this.setState({ pointerDirty: false });
      this.props.clearSearch(props);
    }

    componentDidMount() {
     
    }

    highlightLetters (word) {
      //console.log(word);
      let subcategoryResults = document.getElementsByClassName("subcategory-result");
      if (subcategoryResults.length > 0) {
        for (let i in subcategoryResults) {         
          let result = subcategoryResults[i];
          //debugger;
        }
      }

    }

    render () {
      let self = this;
      let results = this.props.results || [];

      var skills = [], tools = [], users = [], i = 0;

      for (i; i < results.length; i++) {
        if (results[i].type == 'skill') {
          skills.push(results[i]);
        }

        if (results[i].type == 'tool') {
          tools.push(results[i]);
        }

        if (results[i].type == 'user') {
          users.push(results[i]);
        }
      };

      //console.log("SKILLS", skills);
      //console.log("Tools", tools);
      //console.log("users", users);
       this.highlightLetters(this.props.word);

        return (
          <div className="search__results__wrapper">

          {this.props.hasResults ?
            (<div className="search__results">
              <span className="close-suggestion">Press <kbd>ESC</kbd> to close</span>
              <ul>
                <li className="category-list">Skills</li>
                <li className="subcategory-list">
                  <ul>
                    {
                     
                        skills.map(function (skill, props){
                          return <li data-skill={skill.name} className="subcategory-result" data-suggested={skill.suggested} key={skill.id} onClick={self.clickingState.bind(self, props, skill)}>{skill.name}</li>;
                        })
                      
                    }
                  </ul>
                </li>
              </ul>
              <ul>
                <li className="category-list">Tools</li>
                <li className="subcategory-list">
                  <ul>
                    {
                        tools.map(function (tool, props){
                          return <li data-skill={tool.name} className="subcategory-result" data-suggested={tool.suggested} key={tool.id} onClick={self.clickingState.bind(self, props, tool)}>{tool.name}</li>;
                        })
                    }
                  </ul>
                </li>
              </ul>
              <ul>
                <li className="category-list">People</li>
                <li className="subcategory-list">
                  <ul>
                    {
                     
                        users.map(function (person, props){
                          return <li key={person.id} className="subcategory-result" data-suggested={person.suggested} data-id={person.id} onClick={self.showEmployee.bind(self, props, person)}>{person.fullname}</li>;
                        })

                    }
                  </ul>
                </li>
              </ul>
            </div>) : null}
            </div>
        );
    }
}

Results.contextTypes = {
    router: React.PropTypes.object.isRequired
}

export default Results;