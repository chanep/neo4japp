import React from "react";

import { Link } from "react-router";

export default class Map extends React.Component {
    render () {
        var skilledUsersByOffice = this.props.skilledUsersByOffice;
        console.log(skilledUsersByOffice);

        return (
            <div>
              <h2>Resource hotspot</h2>
              <ul className="map-wrapper">
                {this.props.skilledUsersByOffice.NY ?
                  <li className="ny">
                    <a href="#"><span className="location">NY</span><span className="amount">{this.props.skilledUsersByOffice.NY}</span></a>
                  </li>
                : false}
                {this.props.skilledUsersByOffice.LDN ?
                  <li className="ldn">
                    <a href="#"><span className="location">LDN</span><span className="amount">{this.props.skilledUsersByOffice.LDN}</span></a>
                  </li>
                : false}
                {this.props.skilledUsersByOffice.SP ?
                  <li className="sp">
                    <a href="#"><span className="location">SP</span><span className="amount">{this.props.skilledUsersByOffice.SP}</span></a>
                  </li>
                : false}
                {this.props.skilledUsersByOffice.BA ?
                  <li className="ba">
                    <a href="#"><span className="location">BA</span><span className="amount">{this.props.skilledUsersByOffice.BA}</span></a>
                  </li>
                : false}
                {this.props.skilledUsersByOffice.SYD ?
                  <li className="syd">
                    <a href="#"><span className="location">SYD</span><span className="amount">{this.props.skilledUsersByOffice.SYD}</span></a>
                  </li>
                : false}
                {this.props.skilledUsersByOffice.SH ?
                  <li className="sh">
                    <a href="#"><span className="location">SH</span><span className="amount">{this.props.skilledUsersByOffice.SH}</span></a>
                  </li>
                : false}
                {this.props.skilledUsersByOffice.SGP ?
                  <li className="sgp">
                    <a href="#"><span className="location">SGP</span><span className="amount">{this.props.skilledUsersByOffice.SGP}</span></a>
                  </li>
                : false}
                {this.props.skilledUsersByOffice.BU ?
                  <li className="bu">
                    <a href="#"><span className="location">BU</span><span className="amount">{this.props.skilledUsersByOffice.BU}</span></a>
                  </li>
                : false}
                {this.props.skilledUsersByOffice.ATX ?
                  <li className="atx">
                    <a href="#"><span className="location">ATX</span><span className="amount">{this.props.skilledUsersByOffice.ATX}</span></a>
                  </li>
                : false}
                {this.props.skilledUsersByOffice.CHI ?
                  <li className="chi">
                    <a href="#"><span className="location">CHI</span><span className="amount">{this.props.skilledUsersByOffice.CHI}</span></a>
                  </li>
                : false}
                {this.props.skilledUsersByOffice.LA ?
                  <li className="la">
                    <a href="#"><span className="location">LA</span><span className="amount">{this.props.skilledUsersByOffice.LA}</span></a>
                  </li>
                : false}
                {this.props.skilledUsersByOffice.PDX ?
                  <li className="pdx">
                    <a href="#"><span className="location">PDX</span><span className="amount">{this.props.skilledUsersByOffice.PDX}</span></a>
                  </li>
                : false}
                {this.props.skilledUsersByOffice.SF ?
                  <li className="sf">
                    <a href="#"><span className="location">SF</span><span className="amount">{this.props.skilledUsersByOffice.SF}</span></a>
                  </li>
                : false}
                {this.props.skilledUsersByOffice.IST ?
                  <li className="ist">
                    <a href="#"><span className="location">IST</span><span className="amount">{this.props.skilledUsersByOffice.IST}</span></a>
                  </li>
                : false}
              </ul>
            </div>
        );
    }
}