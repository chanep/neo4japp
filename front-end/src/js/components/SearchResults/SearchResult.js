import React from 'react';
import { Router, Route, Link } from 'react-router'
import SkillResult from '../../components/SearchResults/SkillResult';
import AllocPie from './AllocPie'

// Class: SearchResult
export default class SearchResult extends React.Component {
	constructor(obj, key) {
		super();

		this.state = {
			obj: obj.obj,
			key: key,
			showDetails: false
		};
	}

	componentWillReceiveProps(nextProps) {
		this.setState({obj: nextProps.obj.obj});
		this.setState({key: nextProps.key});
		this.setState({showDetails: false});
	}

    getChild (obj,key){
        let result = Object.keys(obj).map(function(k) { return obj[key]});
        return result[0];
    }

    expandContract() {
    	this.setState({showDetails: !this.state.showDetails});
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
			            <span className="table-row">{this.state.obj.skills.length}/{this.props.skillsCount}</span>
			        </div>
			        <div className="col -col-2">
			        	<div className="allocations">
				        	{
				        		this.getChild(this.state.obj.allocation, 'weekHours').map((obj, key) =>
				        			<AllocPie obj={obj} key={key} />
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