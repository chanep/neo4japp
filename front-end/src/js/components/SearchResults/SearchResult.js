import React from 'react';
import { Router, Route, Link } from 'react-router'
import SkillResult from '../../components/SearchResults/SkillResult';
import AllocPie from './AllocPie'
import update from 'react-addons-update';

// Class: SearchResult
export default class SearchResult extends React.Component {
	constructor(obj) {
		super();

		this.state = {
			obj: obj.obj,
			showDetails: false,
			skillsCount: obj.skillsCount
		};
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			obj: nextProps.obj.obj,
			showDetails: false,
			skillsCount: nextProps.skillsCount
		});
	}

    getChild (obj,key){
        let result = Object.keys(obj).map(function(k) { return obj[key]});
        return result[0];
    }

    expandContract() {
		var newState = update(this.state, {
		  showDetails: {$set: !this.state.showDetails}
		});
		this.setState(newState);
		console.log("new state", this.state);

    	//this.setState({showDetails: !this.state.showDetails});
    }

	render() {
        return (
			<li className="-expanded">
			    <div className="header grid">
			        <div className="col -col-4">
			            <p className="table-row-heading">{this.state.obj.fullname}</p>
			            <p className="table-row-small">{this.getChild(this.state.obj.position, 'name')}</p>
			        </div>
			        <div className="col -col-1">
			            <span className="table-row">{this.getChild(this.state.obj.office, 'acronym')}</span>
			        </div>
			        <div className="col -col-1">
			            <span className="table-row">{this.state.obj.skills.length}/{this.state.skillsCount}</span>
			        </div>
			        <div className="col -col-2">
			        	<div className="allocations">
				        	{
				        		this.getChild(this.state.obj.allocation, 'weekHours').map((o, k) =>
				        			<AllocPie obj={o} key={k} />
				        		)
				        	}
				        </div>
			        </div>
			        <div className="btnExpandContract col -col-1" onClick={this.expandContract.bind(this, this.state.obj.id)}>
			            {this.state.showDetails ?
			            	<i className="ss-icon-down-arrow"></i>
			            :
			            	<i className="ss-icon-up-arrow"></i>
			            }
			        </div>
			    </div>
			    {this.state.showDetails ? 
				    <div className="content grid" ref="employeeData">
				        <div className="col -col-9 manager">
				            <span>Manager: <strong>----</strong></span>
				        </div>
				        <ul className="skills grid">
				        	{
				        		this.getChild(this.state.obj, 'skills').map((obj, key) =>
				        			<SkillResult obj={obj} key={key} />
				        		)
				       		}
				        </ul>
				        <div className="samples grid">
				            <div className="col -col-8">
				                <a href={'http://square/people/' + this.state.obj.username + '/'} target="_blank">View work samples &gt;</a>
				            </div>
				        </div>
				    </div>
				: null}
			</li>
        );
    }
}