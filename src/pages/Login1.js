import React, { useState } from "react"
import logo from "../images/logo.svg"
import "./Login.css"
import api from "../services/api"

function Login(props) {
	const [ username, setUsername ] = useState("")
	//useState is a React Hook and as such must be imported from react at the top.
	//The useState hook is a function that receives 1 argument. This argument is going to set the default value
	//for the state variable named in the first element of the array (username in this case).
	//If we wanted to store two different values in state, we would call useState() twice.
	//The second array element returned by the useState is a built in function that updates the current state variable.

	async function handleSubmit(e) {
		e.preventDefault()

		const response = await api.post("/devs", {
			username,
		})
		//we have to wait the response from the api before continue with the javascript thread,
		// that's why we need the async and await
		//the api is a importation of the axios.create function
		//the post method represents the html post method.
		//The first argument is the address complement of the baseURL defined in the imported api.js.
		//This is the address where we register this post method in the backend.
		//The second argument is the body of the request.

		const { _id } = response.data

		props.history.push(`/dev/${_id}`)
		//the react-router-dom automatically includes the history property into the components of each Route (see Route.js)
		//the push will add a /dev/id number to the url address of the login that we get in the history (https://tindev-server.herokuapp.com/)
	}

	return (
		<div className="login-container">
			<form onSubmit={handleSubmit}>
				<img src={logo} alt="Tindev" />
				<input
					type="text"
					placeholder="Enter your GitHub username"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
				/>
				<button type="submit">Enter</button>
			</form>
		</div>
	)
}

export default Login
