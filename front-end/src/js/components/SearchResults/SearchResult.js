import React from 'react';
import { Router, Route, Link } from 'react-router'
import SkillResult from '../../components/SearchResults/SkillResult';

// Class: SearchResult
export default class SearchResult extends React.Component {
	constructor(obj, key, skillsCount) {
		super();

		this.state = {
			obj: obj.obj,
			key: key,
			skillsCount: skillsCount
		};

		console.log(this.state.obj);
		console.log(this.state.skillsCount);
	}

    getChild (obj,key){
        let result = Object.keys(obj).map(function(k) { return obj[key]});
        return result[0];
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
			            <span className="table-row">*/3</span>
			        </div>
			        <div className="col -col-2">
			            <i className="ss-icon-empty"></i>
			            <i className="ss-icon-quarter"></i>
			            <i className="ss-icon-half"></i>
			            <i className="ss-icon-three-quarters"></i>
			        </div>
			        <div className="col -col-1">
			            <i className="ss-icon-down-arrow"></i>
			        </div>
			    </div>
			    <div className="content grid">
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
			                <span>View work samples &gt;</span>
			            </div>
			        </div>
			    </div>
			</li>
        );
    }
}