import React from "react";

import { Link } from "react-router";
import SkillsServices from '../../services/SkillsServices';
import ENV from '../../../config';

export default class TopSearchedSkills extends React.Component {
    constructor() {
      super();
      
      this.state = {
        data: [],
        hoveredSkillId: 0
      };

      this.skillsServices = new SkillsServices();
      this.highlightSkill = this.highlightSkill.bind(this);
    }

    componentDidMount() {
      this.skillsServices.GetTopSkillSearchs(ENV().resourceManagerHome.topSearchedSkillsCount).then(data =>{
        this.setState({data: data});
        this.setState({ hoveredSkillId: data[0].id });
        this.highlightSkill(this.props, data[0].id);
      }).catch(data => {
        console.log("Error performing search", data);
      });
    }

    highlightSkill(props, id) {
      var skillsServices = new SkillsServices();

      this.timer = window.setTimeout(function (id, that) {
        that.setState({ hoveredSkillId: id });
        that.props.getSkilledUsersByOffice(id);
      }, 750, id, this);
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
              <ul className="top-searched-skills">
                {
                  this.state.data.map(function (x, i, props) {
                    return <li className={(this.state.hoveredSkillId == x.id ? 'highlighted' : '')} onMouseOver={() => self.highlightSkill(props, x.id)} onMouseOut={() => self.clear()} key={i}><Link to={'searchresults/' + x.id}>{x.name}</Link></li>
                  }, this)
                }
              </ul>
              <div className="all-skills-link">
                <Link to="/searchallskills">SHOW ALL SKILLS &nbsp;&nbsp;&nbsp;&nbsp; ><span className="icon-right-arrow"></span></Link>
              </div>
            </div>
        );
    }
}