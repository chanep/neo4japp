import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, IndexRoute, hashHistory } from "react-router";

import Layout from "./components/Layout";
import MainContent from "./pages/MainContent";
import Allocations from "./pages/Allocations";

const app = document.getElementById('app');

ReactDOM.render(
	<Router history={hashHistory}>
		<Route path="/" component={Layout}>
			<IndexRoute component={MainContent}></IndexRoute>
			<Route path="allocations" component={Allocations}></Route>
		</Route>
	</Router>,
app);