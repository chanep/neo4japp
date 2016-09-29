/**
 * Pages: SearchResults
 */

// Dependencies
import React from 'react';
import BasePage from './BasePage';
import Header from '../components/Header';
import SearchResultsTable from '../components/SearchResults/SearchResultsTable';

// Class: SearchResults
export default class SearchResults extends BasePage {
	constructor(props) {
		super(props);
	}

    render() {
        return (
            <div>
                <Header search={true} loggedIn={true} />
                <SearchResultsTable skillsIds={this.props.location.query.skillIds} />
            </div>
        );
    }
}
