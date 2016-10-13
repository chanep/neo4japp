/**
 * Components: AddSkillsList
 */

// Dependencies
import React from 'react';
import { Link } from 'react-router';

export default class AddSkillsList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        	data: []
        };
    }

    componentDidMount() {
    	console.log("this.props", this.props);
    }

	componentWillReceiveProps(nextProps) {
		console.log("nextProps", nextProps);
	}

    render() {
        return (
            <div className="addSkillsList col -col-9 -col-no-gutter">
                <ul>
                    <li>
                        <div className="colTable colName">Col 1</div>
                        <div className="colTable colCategory">Col 2</div>
                        <div className="colTable colSkills">Col 3</div>
                        <div className="colArrow">A</div>
                    </li>
                </ul>

            </div>
        );
    }
}