/**
 * Components: AllSkillsList
 */

// Dependencies
import React from 'react';
import { Link } from 'react-router';
import SkillItem from './SkillItem';

export default class AllSkillsList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedGroup: 0,
        	data: []
        };
    }

    componentDidMount() {
        this.setState({
            selectedGroup: this.props.selectedGroup,
            data: this.props.data
        });
    }

	componentWillReceiveProps(nextProps) {
        this.setState({
            selectedGroup: nextProps.selectedGroup,
            data: nextProps.data
        });
	}

    render() {
        let self = this;

        return (
            <div>
            {this.state.data.length > 0 && this.state.selectedGroup > 0 ?
                this.state.data.map(function(obj, key) {
                    if (obj.id === self.state.selectedGroup) {
                        return obj.children.map((subgroup, subgroupKey) => 
                            <SkillItem data={subgroup} parent={obj} key={subgroupKey} />
                        )
                    }
                })
            :
                <div className="selectCategory">Please, select a category</div>
            }
            </div>
        );
    }
}