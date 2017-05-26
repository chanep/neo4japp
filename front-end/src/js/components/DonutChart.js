import React from "react";

export default class DonutChart extends React.Component {
	render () {
    const total = this.props && this.props.total || 100;
    const value = this.props && this.props.value || 0;
    const percent = Math.round(value / total * 100);
    const remainder = 100 - percent;

		return (
      <svg width="65" height="65" viewBox="0 0 36 36" className="donut-chart">
        <circle className="donut-chart__hole" cx="18" cy="18" r="15.91549430918954" fill="#fff"></circle>
        <circle className="donut-chart__remainder" cx="18" cy="18" r="15.91549430918954" fill="transparent" strokeWidth="4.1518680807"></circle>
        <circle className="donut-chart__percent" cx="18" cy="18" r="15.91549430918954" fill="transparent" strokeWidth="4.1518680807" strokeDasharray={percent + ' ' + remainder} strokeDashoffset="25"></circle>
      </svg>
		);
	}
}
