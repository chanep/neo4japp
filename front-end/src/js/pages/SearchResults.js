/**
 * Pages: SearchResults
 */

// Dependencies
import React from 'react';
import Header from '../components/Header';
import SearchResultsTable from '../components/SearchResultsTable';

// Class: SearchResults
export default class SearchResults extends React.Component {
    render() {
        return (
            <div>
                <Header search={true} loggedIn={true} />
                <SearchResultsTable />
            </div>
        );
    }
}
