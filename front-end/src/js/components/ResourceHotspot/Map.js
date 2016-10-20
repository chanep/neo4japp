import React from "react";

import { Link } from "react-router";

var ReactCSSTransitionGroup = require('react-addons-css-transition-group');

export default class Map extends React.Component {
    render () {
        var skilledUsersByOffice = this.props.skilledUsersByOffice,
            skillId = this.props.skillId;

        return (
            <div>
              <h2>Resource hotspot</h2>            
              <ul className="map-wrapper">
                <ReactCSSTransitionGroup 
                  transitionName="example" 
                  transitionEnterTimeout={500} 
                  transitionLeaveTimeout={1}>
                  {this.props.skilledUsersByOffice.NY ?
                    <li className="ny">
                      <Link to={"searchresults/" + this.props.skillId + "?location=NY"}><span className="location">NY</span><span className="amount">{this.props.skilledUsersByOffice.NY}</span></Link>
                    </li>
                  : false}
                  {this.props.skilledUsersByOffice.LDN ?
                    <li className="ldn">
                      <Link to={"searchresults/" + this.props.skillId + "?location=LDN"}><span className="location">LDN</span><span className="amount">{this.props.skilledUsersByOffice.LDN}</span></Link>
                    </li>
                  : false}
                  {this.props.skilledUsersByOffice.SP ?
                    <li className="sp">
                      <Link to={"searchresults/" + this.props.skillId + "?location=SP"}><span className="location">SP</span><span className="amount">{this.props.skilledUsersByOffice.SP}</span></Link>
                    </li>
                  : false}
                  {this.props.skilledUsersByOffice.BA ?
                    <li className="ba">
                      <Link to={"searchresults/" + this.props.skillId + "?location=BA"}><span className="location">BA</span><span className="amount">{this.props.skilledUsersByOffice.BA}</span></Link>
                    </li>
                  : false}
                  {this.props.skilledUsersByOffice.SYD ?
                    <li className="syd">
                      <Link to={"searchresults/" + this.props.skillId + "?location=SYD"}><span className="location">SYD</span><span className="amount">{this.props.skilledUsersByOffice.SYD}</span></Link>
                    </li>
                  : false}
                  {this.props.skilledUsersByOffice.SH ?
                    <li className="sh">
                      <Link to={"searchresults/" + this.props.skillId + "?location=SH"}><span className="location">SH</span><span className="amount">{this.props.skilledUsersByOffice.SH}</span></Link>
                    </li>
                  : false}
                  {this.props.skilledUsersByOffice.SGP ?
                    <li className="sgp">
                      <Link to={"searchresults/" + this.props.skillId + "?location=SGP"}><span className="location">SGP</span><span className="amount">{this.props.skilledUsersByOffice.SGP}</span></Link>
                    </li>
                  : false}
                  {this.props.skilledUsersByOffice.BU ?
                    <li className="bu">
                      <Link to={"searchresults/" + this.props.skillId + "?location=BU"}><span className="location">BU</span><span className="amount">{this.props.skilledUsersByOffice.BU}</span></Link>
                    </li>
                  : false}
                  {this.props.skilledUsersByOffice.ATX ?
                    <li className="atx">
                      <Link to={"searchresults/" + this.props.skillId + "?location=ATX"}><span className="location">ATX</span><span className="amount">{this.props.skilledUsersByOffice.ATX}</span></Link>
                    </li>
                  : false}
                  {this.props.skilledUsersByOffice.CHI ?
                    <li className="chi">
                      <Link to={"searchresults/" + this.props.skillId + "?location=CHI"}><span className="location">CHI</span><span className="amount">{this.props.skilledUsersByOffice.CHI}</span></Link>
                    </li>
                  : false}
                  {this.props.skilledUsersByOffice.LA ?
                    <li className="la">
                      <Link to={"searchresults/" + this.props.skillId + "?location=LA"}><span className="location">LA</span><span className="amount">{this.props.skilledUsersByOffice.LA}</span></Link>
                    </li>
                  : false}
                  {this.props.skilledUsersByOffice.PDX ?
                    <li className="pdx">
                      <Link to={"searchresults/" + this.props.skillId + "?location=PDX"}><span className="location">PDX</span><span className="amount">{this.props.skilledUsersByOffice.PDX}</span></Link>
                    </li>
                  : false}
                  {this.props.skilledUsersByOffice.SF ?
                    <li className="sf">
                      <Link to={"searchresults/" + this.props.skillId + "?location=SF"}><span className="location">SF</span><span className="amount">{this.props.skilledUsersByOffice.SF}</span></Link>
                    </li>
                  : false}
                  {this.props.skilledUsersByOffice.IST ?
                    <li className="ist">
                      <Link to={"searchresults/" + this.props.skillId + "?location=IST"}><span className="location">IST</span><span className="amount">{this.props.skilledUsersByOffice.IST}</span></Link>
                    </li>
                  : false}
                </ReactCSSTransitionGroup>
              </ul>
            </div>
        );
    }
}