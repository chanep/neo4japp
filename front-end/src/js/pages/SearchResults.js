/**
 * Pages: SearchResults
 */

// Dependencies
import React from 'react';
import BasePage from './BasePage';
import Header from '../components/Header';
import SearchResultsTable from '../components/SearchResultsTable';

// Class: SearchResults
export default class SearchResults extends BasePage {
    render() {
        return (
            <div>
                <Header search={true} loggedIn={true} />
                <SearchResultsTable />
            </div>
        );
    }
}
