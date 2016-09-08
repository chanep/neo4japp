import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, IndexRoute, hashHistory } from "react-router";

import Layout from "./components/Layout";
import ResourceHotspot from "./pages/ResourceHotspot";
import Allocations from "./pages/Allocations";
import Login from "./pages/Login";
import SearchResults from "./pages/SearchResults";
import EmployeeProfile from "./pages/EmployeeProfile";
import ManagerHome from "./pages/ManagerHome";

const app = document.getElementById('app');


ReactDOM.render(
	<Router history={hashHistory}>
		<Route path="/" component={Layout}>
			<IndexRoute component={ResourceHotspot}></IndexRoute>
			<Route path="allocations" component={Allocations}></Route>
		</Route>
		<Route path="/login" component={Layout}>
			<IndexRoute component={Login}></IndexRoute>
		</Route>
        <Route path="/searchResults" component={Layout}>
            <IndexRoute component={SearchResults}></IndexRoute>
        </Route>
        <Route path="/employeeProfile" component={Layout}>
            <IndexRoute component={EmployeeProfile}></IndexRoute>
        </Route>
        <Route path="/ManagerHome" component={Layout}>
            <IndexRoute component={ManagerHome}></IndexRoute>
        </Route>
	</Router>,
app);