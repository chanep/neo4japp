import React from "react";
import ReactDom from "react-dom";

import { hashHistory, Link, browserHistory, withRouter } from "react-router";

class Results extends React.Component {

    clickingState (event, props, skill) {
      //console.log("SKILLPROPS" ,props); // THIS ONE TELLS THE ELEMENT THAT HAS BEEN CLICKED

      //TODO: check if ID is already in array
      //console.log("CLICK-STATE E" , event);
      //console.log("CLICK-STATE P", props);
      //console.log("CLICK-STATE S", skill);
      this.props.addItem(props);
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

      var skills = [], tools = [], users = [], interests = [], industries = [], clients = [], i = 0;

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

        if (results[i].type == 'interest') {
          interests.push(results[i]);
        }

        if (results[i].type == 'industry') {
          industries.push(results[i]);
        }

        if (results[i].type == 'client') {
          clients.push(results[i]);
        }
      };

      //console.log("SKILLS", skills);
      //console.log("Tools", tools);
      //console.log("users", users);
       this.highlightLetters(this.props.word);

        return (
          <div className="search__results__wrapper">

          {skills.length > 0 || tools.length > 0 || users.length > 0 || interests.length > 0 || industries.length > 0 || clients.length > 0 ?
            (<div className="search__results">
              <span className="close-suggestion">Press <kbd>ESC</kbd> to close</span>
              {skills.length > 0 ?
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
              : false}
              {tools.length > 0 ?
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
              : false}
              {users.length > 0 ?
              <ul>
                <li className="category-list">People</li>
                <li className="subcategory-list">
                  <ul>
                    {

                        users.map(function (person, props){
                          return <li key={person.id} className="subcategory-result" data-suggested={person.suggested} data-id={person.id} onClick={self.clickingState.bind(self, props, person)}>{person.fullname}</li>;
                        })

                    }
                  </ul>
                </li>
              </ul>
              : false}
              {interests.length > 0 ?
              <ul>
                <li className="category-list">Interests</li>
                <li className="subcategory-list">
                  <ul>
                    {

                        interests.map(function (interest, props){
                          return <li key={interest.id} className="subcategory-result" data-suggested={interest.suggested} data-id={interest.id} onClick={self.clickingState.bind(self, props, interest)}>{interest.name}</li>;
                        })

                    }
                  </ul>
                </li>
              </ul>
              : false}
              {industries.length > 0 ?
              <ul>
                <li className="category-list">Industries</li>
                <li className="subcategory-list">
                  <ul>
                    {

                        industries.map(function (industry, props){
                          return <li key={industry.id} className="subcategory-result" data-suggested={industry.suggested} data-id={industry.id} onClick={self.clickingState.bind(self, props, industry)}>{industry.name}</li>;
                        })

                    }
                  </ul>
                </li>
              </ul>
              : false}
              {clients.length > 0 ?
              <ul>
                <li className="category-list">Clients</li>
                <li className="subcategory-list">
                  <ul>
                    {

                        clients.map(function (client, props){
                          return <li key={client.id} className="subcategory-result" data-suggested={client.suggested} data-id={client.id} onClick={self.clickingState.bind(self, props, client)}>{client.name}</li>;
                        })

                    }
                  </ul>
                </li>
              </ul>
              : false}

            </div>) : null}
            </div>
        );
    }
}

Results.contextTypes = {
    router: React.PropTypes.object.isRequired
}

export default Results;
