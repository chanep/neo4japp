import React from "react";

export default class OfficeMap extends React.Component {
	render () {
		return (
			<div className="office-map">
  			<div className="office-map__spacer">
          <div className="office-map__marker" data-office={this.props.office}></div>
  			</div>
			</div>
		);
	}
}
