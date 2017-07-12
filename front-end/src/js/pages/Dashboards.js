/**
 * Pages: Dashboards
 */

// Dependencies
import React from 'react';
import { Link } from "react-router";

import Breadcrumbs from 'react-breadcrumbs';

import BasePage from './BasePage';
import Header from '../components/Header';

// Class: Dashboards
export default class Dashboards extends BasePage {
    render() {
        return (
            <div className="body-layout dashboards-container">
              <Breadcrumbs
                 routes={this.props.routes}
                 params={this.props.params}
                 excludes={['App']}
                 separator=' / '
              />
              {this.props.children}
            </div>
        );
    }
}
