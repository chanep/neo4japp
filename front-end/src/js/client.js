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
import MySkills from "./pages/MySkills";
import EmployeeVerification from "./pages/EmployeeVerification";

const app = document.getElementById('app');


ReactDOM.render(
	<Router history={hashHistory}>
		<Route path="/" component={Layout}>
			<IndexRoute component={Login}></IndexRoute>
                  <Route path="/login" component={Login}></Route>
                  <Route path="/resourceshotspot" component={ResourceHotspot}></Route>
                  <Route path="/allocations" component={Layout}></Route>
                  <Route path="/searchresults" component={SearchResults}>
            	     <Route path="/searchresults/:skillIds" component={SearchResults}/>
                  </Route>
                  <Route path="/myprofile" component={EmployeeProfile}></Route>
                  <Route path="/myprofile/myskills" component={MySkills}></Route>
                  <Route path="/employee/:employeeID" component={EmployeeProfile}/>
                  <Route path="/employee/:employeeID/verification" component={EmployeeVerification}/>
                  <Route path="/managerhome" component={ManagerHome}></Route>
                  <Route path="/resultsprofile" component={ResultsProfile}></Route>
                  <Route path="/searchallskills" component={SearchAllSkills}></Route>
		</Route>
	</Router>,
app);