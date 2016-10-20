/**
 * Components: MyTeamTable
 */

// Dependencies
import React from 'react';
import MyTeamEmployee from './MyTeamEmployee';

// Class: MyTeamTable
export default class MyTeamTable extends React.Component {
    constructor() {
        super();

        this.state = {
        	data: null
        };
    }

    componentDidMount() {
    	this.setState({
    		data: this.props.myTeam
    	});
    }

    componentWillReceiveProps(nextProps) {
    	this.setState({
    		data: nextProps.myTeam
    	});
    }

    render() {
    	if (this.state.data === null)
    		return <div />

    	return (
    		<div>
                <div className="header-bar col -col-9 -col-no-gutter">
                    <div className="col -col-7">
                        <span className="table-header">Employee</span>
                    </div>
                    <div className="col -col-2">
                        <span className="table-header">Location</span>
                    </div>
                    <div className="col -col-2">
                        <span className="table-header">Review Skills</span>
                    </div>
                </div>
                <div className="results-section">
                	<div className="manager-home results results--right col -col-9 -col-no-gutter">
                	{
                		this.state.data.map((employee, key) => {
	                        return (
	                        	<MyTeamEmployee employee={employee} key={key} />
	                        );
                		})
                	}
                    </div>
                </div>
    		</div>
    	);
    }
}