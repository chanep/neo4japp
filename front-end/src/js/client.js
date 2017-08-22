import React from "react";
import ReactDOM from "react-dom";
import Modal from "react-modal";
import { Router, Route, IndexRoute, Redirect, hashHistory } from "react-router";

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
import Dashboards from "./pages/Dashboards";
import DashboardList from "./components/Dashboards/DashboardList";
import ComplianceDashboard from "./components/Dashboards/ComplianceDashboard";
import GroupOverview from "./components/ComplianceDashboard/GroupOverview";
import ActiveGroupDetail from "./components/ComplianceDashboard/ActiveGroupDetail";
import InactiveGroupDetail from "./components/ComplianceDashboard/InactiveGroupDetail";
import FAQ from "./pages/FAQ";
import PageError from "./pages/PageError";

const app = document.getElementById('app');

ReactDOM.render(
	<Router history={hashHistory}>
		<Route path="/" component={Layout} name="App">
			<IndexRoute component={Login}></IndexRoute>
			<Route path="/login" component={Login}></Route>
			<Route path="/resourceshotspot" component={ResourceHotspot}></Route>
			<Route path="/allocations" component={Layout}></Route>
			<Route path="/searchresults" component={SearchResults}></Route>
			<Route path="/myprofile" component={EmployeeProfile}></Route>
			<Route path="/myprofile/myskills" component={MySkills}></Route>
			<Route path="/employee/:employeeID" component={EmployeeProfile}/>
			<Route path="/employee/:employeeID/verification" component={EmployeeVerification}/>
			<Route path="/managerhome" component={ManagerHome}></Route>
			<Route path="/resultsprofile" component={ResultsProfile}></Route>
			<Route path="/searchallskills" component={SearchAllSkills}></Route>
			<Route path="/dashboards" component={Dashboards} name="Dashboards">
				<IndexRoute component={DashboardList}/>
				<Route path="/dashboards/compliance" component={ComplianceDashboard} name="Compliance" staticName={true}></Route>
				<Route path="/dashboards/compliance/" component={ComplianceDashboard} name="Compliance" staticName={true}></Route>
				<Route path="/dashboards/compliance/:employeeGroup" component={ComplianceDashboard} name="Compliance" staticName={true}>
					<IndexRoute component={GroupOverview}/>
					<Route path="active" component={ActiveGroupDetail} name="Active Users" />
					<Route path="inactive" component={InactiveGroupDetail} name="Inactive Users" />
				</Route>
			</Route>

			<Route path="/faq" component={FAQ}></Route>
			<Route path="/error" component={PageError}></Route>
			<Route path="*" component={PageError}></Route>
		</Route>
	</Router>,
app);
