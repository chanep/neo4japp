/**
 * Pages: SearchAllSkills
 */

// Dependencies
import React from 'react';
import Header from '../components/Header';
import SearchAllSkillsTable from '../components/SearchAllSkillsTable';

// Class: SearchResults
export default class SearchResults extends React.Component {
    render() {
        return (
            <div>
                <Header search={true} loggedIn={true} />
                <SearchAllSkillsTable />
            </div>
        );
    }
}
