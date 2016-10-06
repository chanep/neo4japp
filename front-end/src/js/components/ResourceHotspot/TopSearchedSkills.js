import React from "react";

import { Link } from "react-router";
import SkillsServices from '../../services/SkillsServices';
import ENV from '../../../config';

export default class TopSearchedSkills extends React.Component {
    constructor() {
      super();
      
      this.state = {
        data: []
      };

      this.skillsServices = new SkillsServices();
    }

    componentDidMount() {
      this.skillsServices.GetTopSkillSearchs(ENV().resourceManagerHome.topSearchedSkillsCount).then(data =>{
        this.setState({data: data});
        console.log("state component", this.state);
      }).catch(data => {
        console.log("Error performing search", data);
      });
    }

    render () {
        console.log("state", this.state);
        return (
            <div>
              <h2>Top Searched Skills</h2>
              <ul>
                {
                  this.state.data.map((x, i) =>
                    <li key={i}><Link to={'searchResults/' + x.id}>{x.name}</Link></li>
                  )
                }
              </ul>
              <a href="#" className="arrow-btn">Show all skills<span className="icon-right-arrow"></span></a>
            </div>
        );
    }
}