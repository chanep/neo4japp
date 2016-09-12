/**
 * Components: SkillsLevelTable
 */

// Dependencies
import React from 'react';

// Class: SkillsLevelTable
export default class SkillsLevelTable extends React.Component {
    constructor(search, loggedIn) {
        super();
        this.state = {
            'search': search,
            'loggedIn': loggedIn
        };
    }

    render() {
        return (
            <div className="skill-level-grid">
                <div className="skill-level-grid__header col -col-12 -col-no-gutter">
                    <div className="col -col-2">
                        <span className="table-header"></span>
                    </div>
                    <div className="col -col-1">
                        <span className="table-header">Want?</span>
                    </div>
                    <div className="col -col-2">
                        <span className="table-header">Heavy Survision</span>
                    </div>
                    <div className="col -col-2">
                        <span className="table-header">Light Survision</span>
                    </div>
                    <div className="col -col-2">
                        <span className="table-header">No Survision</span>
                    </div>
                    <div className="col -col-2">
                        <span className="table-header">Teach/Manage</span>
                    </div>
                    <div className="col -col-1 skill-level-empty">
                        <span className="table-header"></span>
                    </div>
                </div>

                <div className="skill-level-grid__levels col -col-12 -col-no-gutter">
                    <div className="col -col-2">
                        <span className="table-header">Brand Strategy</span>
                    </div>
                    <div className="col -col-1">
                        <span className="skill-title">
                            <input type="radio" label="skill-want" />
                        </span>
                    </div>
                    <div className="col -col-2 skill-level-box">
                        <span className="skill-title"></span>
                    </div>
                    <div className="col -col-2 skill-level-box level-selected">
                        <span className="skill-title"></span>
                    </div>
                    <div className="col -col-2 skill-level-box">
                        <span className="skill-title"></span>
                    </div>
                    <div className="col -col-2 skill-level-box">
                        <span className="skill-title"></span>
                    </div>
                    <div className="col -col-1">
                        <span className="skill-title"></span>
                    </div>
                </div>

                <div className="skill-level-grid__levels col -col-12 -col-no-gutter">
                    <div className="col -col-2">
                        <span className="table-header">Brand Strategy</span>
                    </div>
                    <div className="col -col-1">
                        <span className="skill-title">
                            <input type="radio" label="skill-want" />
                        </span>
                    </div>
                    <div className="col -col-2 skill-level-box">
                        <span className="skill-title"></span>
                    </div>
                    <div className="col -col-2 skill-level-box">
                        <span className="skill-title"></span>
                    </div>
                    <div className="col -col-2 skill-level-box">
                        <span className="skill-title"></span>
                    </div>
                    <div className="col -col-2 skill-level-box level-selected">
                        <span className="skill-title"></span>
                    </div>
                    <div className="col -col-1">
                        <span className="skill-title"></span>
                    </div>
                </div>

                <div className="skill-level-grid__levels col -col-12 -col-no-gutter">
                    <div className="col -col-2">
                        <span className="table-header">Brand Strategy</span>
                    </div>
                    <div className="col -col-1">
                        <span className="skill-title">
                            <input type="radio" label="skill-want" />
                        </span>
                    </div>
                    <div className="col -col-2 skill-level-box level-selected">
                        <span className="skill-title"></span>
                    </div>
                    <div className="col -col-2 skill-level-box">
                        <span className="skill-title"></span>
                    </div>
                    <div className="col -col-2 skill-level-box">
                        <span className="skill-title"></span>
                    </div>
                    <div className="col -col-2 skill-level-box">
                        <span className="skill-title"></span>
                    </div>
                    <div className="col -col-1">
                        <span className="skill-title"></span>
                    </div>
                </div>
            </div>
        );
    }
}
