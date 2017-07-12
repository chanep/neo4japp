import React from "react";

import { Link } from "react-router";

import BasePage from './BasePage';
import Header from "../components/Header";
import TopSearchedSkills from "../components/ResourceHotspot/TopSearchedSkills";
import Map from "../components/ResourceHotspot/Map";
import SkillsServices from '../services/SkillsServices';
import ENV from '../../config';

export default class ResourceHotspot extends BasePage {
  constructor() {
      super();

      this.state = {
        skilledUsersByOffice: {},
        skillId: 0
      };

      this.getSkilledUsersByOffice = this.getSkilledUsersByOffice.bind(this);
    }

    getSkilledUsersByOffice(skillId) {
      var skillsServices = new SkillsServices();

      skillsServices.GetSkilledUsersByOffice(skillId, ENV().resourceManagerHome.topSearchedSkillsCount).then(offices =>{

        var skilledUsersByOffice = [];

        offices.forEach(function (office) {
          console.log(office);
          skilledUsersByOffice[office.acronym] = [office.id, office.skilledUserCount];
        });

        this.setState({ skilledUsersByOffice: skilledUsersByOffice });
        this.setState({ skillId: skillId });
      }).catch(data => {
          console.log("skill data error", data);
      });
    }

    render () {
        return (
            <section className="main-content">
              <div className="two-col-wrapper resource-manager-map">
                <div className="left-col">
                 <TopSearchedSkills getSkilledUsersByOffice={this.getSkilledUsersByOffice} />
                </div>
                <div className="right-col">
                 <Map skilledUsersByOffice={this.state.skilledUsersByOffice} skillId={this.state.skillId} />
                </div>
              </div>
            </section>
        );
    }
}
