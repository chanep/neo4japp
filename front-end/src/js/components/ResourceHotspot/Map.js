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
                      <Link to={"/searchresults/" + this.props.skillId + "/" + this.props.skilledUsersByOffice.NY[0]}><span className="location">NY</span><span className="amount">{this.props.skilledUsersByOffice.NY[1]}</span></Link>
                    </li>
                  : false}
                  {this.props.skilledUsersByOffice.LDN ?
                    <li className="ldn">
                      <Link to={"/searchresults/" + this.props.skillId + "/" + this.props.skilledUsersByOffice.LDN[0]}><span className="location">LDN</span><span className="amount">{this.props.skilledUsersByOffice.LDN[1]}</span></Link>
                    </li>
                  : false}
                  {this.props.skilledUsersByOffice.SP ?
                    <li className="sp">
                      <Link to={"/searchresults/" + this.props.skillId + "/" + this.props.skilledUsersByOffice.SP[0]}><span className="location">SP</span><span className="amount">{this.props.skilledUsersByOffice.SP[1]}</span></Link>
                    </li>
                  : false}
                  {this.props.skilledUsersByOffice.BA ?
                    <li className="ba">
                      <Link to={"/searchresults/" + this.props.skillId + "/" + this.props.skilledUsersByOffice.BA[0]}><span className="location">BA</span><span className="amount">{this.props.skilledUsersByOffice.BA[1]}</span></Link>
                    </li>
                  : false}
                  {this.props.skilledUsersByOffice.SYD ?
                    <li className="syd">
                      <Link to={"/searchresults/" + this.props.skillId + "/" + this.props.skilledUsersByOffice.SYD[0]}><span className="location">SYD</span><span className="amount">{this.props.skilledUsersByOffice.SYD[1]}</span></Link>
                    </li>
                  : false}
                  {this.props.skilledUsersByOffice.SH ?
                    <li className="sh">
                      <Link to={"/searchresults/" + this.props.skillId + "/" + this.props.skilledUsersByOffice.SH[0]}><span className="location">SH</span><span className="amount">{this.props.skilledUsersByOffice.SH[1]}</span></Link>
                    </li>
                  : false}
                  {this.props.skilledUsersByOffice.SGP ?
                    <li className="sgp">
                      <Link to={"/searchresults/" + this.props.skillId + "/" + this.props.skilledUsersByOffice.SGP[0]}><span className="location">SGP</span><span className="amount">{this.props.skilledUsersByOffice.SGP[1]}</span></Link>
                    </li>
                  : false}
                  {this.props.skilledUsersByOffice.BU ?
                    <li className="bu">
                      <Link to={"/searchresults/" + this.props.skillId + "/" + this.props.skilledUsersByOffice.BU[0]}><span className="location">BU</span><span className="amount">{this.props.skilledUsersByOffice.BU[1]}</span></Link>
                    </li>
                  : false}
                  {this.props.skilledUsersByOffice.ATX ?
                    <li className="atx">
                      <Link to={"/searchresults/" + this.props.skillId + "/" + this.props.skilledUsersByOffice.ATX[0]}><span className="location">ATX</span><span className="amount">{this.props.skilledUsersByOffice.ATX[1]}</span></Link>
                    </li>
                  : false}
                  {this.props.skilledUsersByOffice.CHI ?
                    <li className="chi">
                      <Link to={"/searchresults/" + this.props.skillId + "/" + this.props.skilledUsersByOffice.CHI[0]}><span className="location">CHI</span><span className="amount">{this.props.skilledUsersByOffice.CHI[1]}</span></Link>
                    </li>
                  : false}
                  {this.props.skilledUsersByOffice.LA ?
                    <li className="la">
                      <Link to={"/searchresults/" + this.props.skillId + "/" + this.props.skilledUsersByOffice.LA[0]}><span className="location">LA</span><span className="amount">{this.props.skilledUsersByOffice.LA[1]}</span></Link>
                    </li>
                  : false}
                  {this.props.skilledUsersByOffice.PDX ?
                    <li className="pdx">
                      <Link to={"/searchresults/" + this.props.skillId + "/" + this.props.skilledUsersByOffice.PDX[0]}><span className="location">PDX</span><span className="amount">{this.props.skilledUsersByOffice.PDX[1]}</span></Link>
                    </li>
                  : false}
                  {this.props.skilledUsersByOffice.SF ?
                    <li className="sf">
                      <Link to={"/searchresults/" + this.props.skillId + "/" + this.props.skilledUsersByOffice.SF[0]}><span className="location">SF</span><span className="amount">{this.props.skilledUsersByOffice.SF[1]}</span></Link>
                    </li>
                  : false}
                  {this.props.skilledUsersByOffice.IST ?
                    <li className="ist">
                      <Link to={"/searchresults/" + this.props.skillId + "/" + this.props.skilledUsersByOffice.IST[0]}><span className="location">IST</span><span className="amount">{this.props.skilledUsersByOffice.IST[1]}</span></Link>
                    </li>
                  : false}
                </ReactCSSTransitionGroup>
              </ul>
            </div>
        );
    }
}