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
import ResultsProfile from "./pages/ResultsProfile";
import SearchAllSkills from "./pages/SearchAllSkills";

const app = document.getElementById('app');


ReactDOM.render(
	<Router history={hashHistory}>
		<Route path="/" component={Layout}>
			<IndexRoute component={Login}></IndexRoute>
            <Route path="/login" component={Login}></Route>
            <Route path="/resourcesHotspot" component={ResourceHotspot}></Route>
            <Route path="/allocations" component={Layout}></Route>
            <Route path="/searchResults" component={SearchResults}></Route>
            <Route path="/employeeProfile" component={EmployeeProfile}></Route>
            <Route path="/ManagerHome" component={ManagerHome}></Route>
            <Route path="/ResultsProfile" component={ResultsProfile}></Route>
            <Route path="/SearchAllSkills" component={SearchAllSkills}></Route>
		</Route>
	</Router>,
app);