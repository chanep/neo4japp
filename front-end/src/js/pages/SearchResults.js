/**
 * Pages: SearchResults
 */

// Dependencies
import React from 'react';
import BasePage from './BasePage';
import Header from '../components/Header';
import SearchServices from '../services/SearchServices';
import SearchResultsTable from '../components/SearchResults/SearchResultsTable';

// Class: SearchResults
export default class SearchResults extends BasePage {
	constructor(props) {
		super(props);

        this.searchServices = new SearchServices();
        this.state = {
            data: [],
            skillsCount: 0,
            searching: true,
            location: ''
        };
	}

    getData(ids) {
        this.setState({data: [], skillsCount: 0, searching: true});

        this.searchServices.GetSearchBySkills(ids, 20).then(data => {
            this.setState({
                data: data,
                skillsCount:ids.length,
                searching: false
            });
        }).catch(data => {
          
            console.log("Error performing search", data);
          
        });
    }

    componentDidMount() {
        if (this.props.params.skillIds !== undefined) {
            let ids = this.props.params.skillIds.split(',');

            this.getData(ids);
        }

        if (this.props.location.search !== undefined) {
            let location = this.props.location.search.split('=')[1];
            this.setState({ location: location });
        }
    }

    componentWillReceiveProps(newProps) {
        if (newProps.params.skillIds !== undefined) {
            let ids = newProps.params.skillIds.split(',');

            this.getData(ids);
        }
    }

    render() {
        return (
            <div>
                <Header search={true} loggedIn={true} />
                <SearchResultsTable data={this.state.data} skillsCount={this.state.skillsCount} searching={this.state.searching} />
            </div>
        );
    }
}
