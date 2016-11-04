import React from 'react';
import { Router, Route, Link } from 'react-router'
import AllocPie from './AllocPie'

// Class: AllocationData
export default class AllocationData extends React.Component {
	constructor(obj) {
		super();

		this.state = {
			employeeId: obj.employeeId,
			allocations: obj.allocations
		};
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			employeeId: nextProps.employeeId,
			allocations: nextProps.allocations
		});
	}

	render() {
		if (this.state.allocations === null || this.state.allocations === undefined)
			return <div className="allocations"><div className="no-data">No allocation data available</div></div>

		let self = this;
		return (
			<div className="allocations">
				{
					[0,1,2,3].map(function(index) {
						let allocHours = 0;
						let totalWekHour = 0;
						let startingDate = null;
						if (index+1 <= self.state.allocations.weekHours.length) {
							allocHours = self.state.allocations.weekHours[index];
							totalWekHour = self.state.allocations.workingWeekHours[index];
							startingDate = self.state.allocations.startDate[index];
						}
						return (<AllocPie currentEmployee={self.state.employeeId} startWeek={startingDate} allocatedHour={allocHours} totalWeekHour={totalWekHour} key={index} />);
					})
				}
			</div>
		)
	}
}