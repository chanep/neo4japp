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
      this.highlightSkill = this.highlightSkill.bind(this);
    }

    componentDidMount() {
      this.skillsServices.GetTopSkillSearchs(ENV().resourceManagerHome.topSearchedSkillsCount).then(data =>{
        this.setState({data: data});
      }).catch(data => {
        console.log("Error performing search", data);
      });
    }

    highlightSkill(props, name, id) {
      var skillsServices = new SkillsServices();

      console.log(id);

      this.timer = window.setTimeout(function (name, id, props) {
        props.getSkilledUsersByOffice(id);
      }, 2000, name, 273, this.props);
    }

    clear() {
      if (this.timer)
        window.clearTimeout(this.timer);
    }

    render () {
        let self = this;

        return (
            <div>
              <h2>Top Searched Skills</h2>
              <ul>
                {
                  this.state.data.map(function (x, i, props) {
                    return <li onMouseOver={() => self.highlightSkill(props, x.name, x.id)} onMouseOut={() => self.clear()} key={i}><Link to={'searchresults/' + x.id}>{x.name}</Link></li>
                  })
                }
              </ul>
              <a href="#" className="arrow-btn">Show all skills<span className="icon-right-arrow"></span></a>
            </div>
        );
    }
}