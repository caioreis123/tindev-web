import React from "react"
import { BrowserRouter, Route } from "react-router-dom"

import Login from "./pages/Login1.js/index.js"
import List from "./pages/List"

function Routes() {
	return (
		<BrowserRouter>
			<Route path="/" exact component={Login} />
			<Route path="/dev/:id" component={List} />
		</BrowserRouter>
	)
}

export default Routes
