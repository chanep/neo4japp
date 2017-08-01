import React from "react";

import { Link } from "react-router";
import {gaSearchLocationSearch} from '../../services/GoogleAnalytics';

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
                      <Link className='locationsearch-location' to={"/searchresults?skills=" + this.props.skillId + "&locations=" + this.props.skilledUsersByOffice.NY[0]} onClick={gaSearchLocationSearch.bind(this, "NY")}><span className="location">NY</span><span className="amount">{this.props.skilledUsersByOffice.NY[1]}</span></Link>
                    </li>
                  : false}
                  {this.props.skilledUsersByOffice.LDN ?
                    <li className="ldn">
                      <Link className='locationsearch-location' to={"/searchresults?skills=" + this.props.skillId + "&locations=" + this.props.skilledUsersByOffice.LDN[0]} onClick={gaSearchLocationSearch.bind(this, "LDN")}><span className="location">LDN</span><span className="amount">{this.props.skilledUsersByOffice.LDN[1]}</span></Link>
                    </li>
                  : false}
                  {this.props.skilledUsersByOffice.SP ?
                    <li className="sp">
                      <Link className='locationsearch-location' to={"/searchresults?skills=" + this.props.skillId + "&locations=" + this.props.skilledUsersByOffice.SP[0]} onClick={gaSearchLocationSearch.bind(this, "SP")}><span className="location">SP</span><span className="amount">{this.props.skilledUsersByOffice.SP[1]}</span></Link>
                    </li>
                  : false}
                  {this.props.skilledUsersByOffice.BA ?
                    <li className="ba">
                      <Link className='locationsearch-location' to={"/searchresults?skills=" + this.props.skillId + "&locations=" + this.props.skilledUsersByOffice.BA[0]} onClick={gaSearchLocationSearch.bind(this, "BA")}><span className="location">BA</span><span className="amount">{this.props.skilledUsersByOffice.BA[1]}</span></Link>
                    </li>
                  : false}
                  {this.props.skilledUsersByOffice.SYD ?
                    <li className="syd">
                      <Link className='locationsearch-location' to={"/searchresults?skills=" + this.props.skillId + "&locations=" + this.props.skilledUsersByOffice.SYD[0]} onClick={gaSearchLocationSearch.bind(this, "SYD")}><span className="location">SYD</span><span className="amount">{this.props.skilledUsersByOffice.SYD[1]}</span></Link>
                    </li>
                  : false}
                  {this.props.skilledUsersByOffice.SH ?
                    <li className="sh">
                      <Link className='locationsearch-location' to={"/searchresults?skills=" + this.props.skillId + "&locations=" + this.props.skilledUsersByOffice.SH[0]} onClick={gaSearchLocationSearch.bind(this, "SH")}><span className="location">SH</span><span className="amount">{this.props.skilledUsersByOffice.SH[1]}</span></Link>
                    </li>
                  : false}
                  {this.props.skilledUsersByOffice.SGP ?
                    <li className="sgp">
                      <Link className='locationsearch-location' to={"/searchresults?skills=" + this.props.skillId + "&locations=" + this.props.skilledUsersByOffice.SGP[0]} onClick={gaSearchLocationSearch.bind(this, "SGP")}><span className="location">SGP</span><span className="amount">{this.props.skilledUsersByOffice.SGP[1]}</span></Link>
                    </li>
                  : false}
                  {this.props.skilledUsersByOffice.BU ?
                    <li className="bu">
                      <Link className='locationsearch-location' to={"/searchresults?skills=" + this.props.skillId + "&locations=" + this.props.skilledUsersByOffice.BU[0]} onClick={gaSearchLocationSearch.bind(this, "BU")}><span className="location">BU</span><span className="amount">{this.props.skilledUsersByOffice.BU[1]}</span></Link>
                    </li>
                  : false}
                  {this.props.skilledUsersByOffice.ATX ?
                    <li className="atx">
                      <Link className='locationsearch-location' to={"/searchresults?skills=" + this.props.skillId + "&locations=" + this.props.skilledUsersByOffice.ATX[0]} onClick={gaSearchLocationSearch.bind(this, "ATX")}><span className="location">ATX</span><span className="amount">{this.props.skilledUsersByOffice.ATX[1]}</span></Link>
                    </li>
                  : false}
                  {this.props.skilledUsersByOffice.CHI ?
                    <li className="chi">
                      <Link className='locationsearch-location' to={"/searchresults?skills=" + this.props.skillId + "&locations=" + this.props.skilledUsersByOffice.CHI[0]} onClick={gaSearchLocationSearch.bind(this, "CHI")}><span className="location">CHI</span><span className="amount">{this.props.skilledUsersByOffice.CHI[1]}</span></Link>
                    </li>
                  : false}
                  {this.props.skilledUsersByOffice.LA ?
                    <li className="la">
                      <Link className='locationsearch-location' to={"/searchresults?skills=" + this.props.skillId + "&locations=" + this.props.skilledUsersByOffice.LA[0]} onClick={gaSearchLocationSearch.bind(this, "LA")}><span className="location">LA</span><span className="amount">{this.props.skilledUsersByOffice.LA[1]}</span></Link>
                    </li>
                  : false}
                  {this.props.skilledUsersByOffice.PDX ?
                    <li className="pdx">
                      <Link className='locationsearch-location' to={"/searchresults?skills=" + this.props.skillId + "&locations=" + this.props.skilledUsersByOffice.PDX[0]} onClick={gaSearchLocationSearch.bind(this, "PDX")}><span className="location">PDX</span><span className="amount">{this.props.skilledUsersByOffice.PDX[1]}</span></Link>
                    </li>
                  : false}
                  {this.props.skilledUsersByOffice.SF ?
                    <li className="sf">
                      <Link className='locationsearch-location' to={"/searchresults?skills=" + this.props.skillId + "&locations=" + this.props.skilledUsersByOffice.SF[0]} onClick={gaSearchLocationSearch.bind(this, "SF")}><span className="location">SF</span><span className="amount">{this.props.skilledUsersByOffice.SF[1]}</span></Link>
                    </li>
                  : false}
                  {this.props.skilledUsersByOffice.IST ?
                    <li className="ist">
                      <Link className='locationsearch-location' to={"/searchresults?skills=" + this.props.skillId + "&locations=" + this.props.skilledUsersByOffice.IST[0]} onClick={gaSearchLocationSearch.bind(this, "IST")}><span className="location">IST</span><span className="amount">{this.props.skilledUsersByOffice.IST[1]}</span></Link>
                    </li>
                  : false}
                </ReactCSSTransitionGroup>
              </ul>
            </div>
        );
    }
}