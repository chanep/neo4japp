/**
 * Pages: SearchAllSkills
 */

// Dependencies
import React from 'react';
import BasePage from './BasePage';
import Header from '../components/Header';
import SearchAllSkillsTable from '../components/SearchAllSkillsTable';

// Class: SearchResults
export default class SearchResults extends BasePage {
    render() {
        return (
            <div>
                <Header search={super._showSearch()} loggedIn={true} />
                <SearchAllSkillsTable />
            </div>
        );
    }
}
