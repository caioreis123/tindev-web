import React, { useEffect, useState } from "react"
import logo from "../images/logo.svg"
import like from "../images/like.svg"
import dislike from "../images/dislike.svg"
import itsamatch from "../images/itsamatch.png"
import "./List.css"
import api from "../services/api"
import { Link } from "react-router-dom"
import io from "socket.io-client"

function List(props) {
	const [ users, setUsers ] = useState([])
	//this state will store all the users that will be displayed to be liked or not

	const [ devMatch, setDevMatch ] = useState(null)
	//this will create a state in which we will store the matched user json data

	useEffect(
		() => {
			async function loadUsers() {
				const response = await api.get("/devs", {
					headers: {
						user: props.match.params.id,
					},
				})
				setUsers(response.data)
				//this setUsers function is filling the users state variable with all the json data we are getting as response
				//from our API request using axios.
				//Since we only want the users that we have not liked or disliked we have to pass our own id that is in the url
				//address to to the get method
			}
			loadUsers()
			//now we are calling the function
		},
		[ props.match.params.id ],
	)
	//the useEffect react hook is a function that receives 2 arguments,
	//the first is the function that is going to be executed.
	//the second is the moment of execution. This moment is every time some variable inside the array is updated.
	//If the array is empty the function is going to be executed only once.
	//In this use case the useEffect is running every time the id in the url changes.
	//We put another function (loadUsers) inside the arrow function because we wanted to use the async/await feature.

	useEffect(
		() => {
			const socket = io("https://tindev-server.herokuapp.com/", {
				query: { user: props.match.params.id },
			})
			//we are writing the ip of our backend to create a websocket connection to it
			// and just by doing this the connection is created, we don't even need to use the socket variable.
			//But we will to send a message.
			//the second argument of the io method is optional, and represents additional information that can be sent

			socket.on("match", (dev) => {
				setDevMatch(dev)
			})
		},
		[ props.match.params.id ],
	)

	async function handleDislike(id) {
		await api.post(`/devs/${id}/dislikes`, null, {
			headers: {
				user: props.match.params.id,
				//here we are sending the id of the current user, the one disliking. On the server we build in a way that the
				//active user id was send on the header. The header is the third argument in the POST method (different from the get method). The second argument
				//is the body that in our api we did not put, that is way is null.
			},
		})
		setUsers(users.filter((user) => user._id !== id))
		//setUsers is setting the users variable state (that is an array) to only return users that has an id different
		//than the one received as liked or disliked.
		//Despite being an array you can't change state with .push .slice and such. Because is a react state.
		//The only way to change it is with setState().
	}
	async function handleLike(id) {
		await api.post(`/devs/${id}/likes`, null, {
			headers: {
				user: props.match.params.id,
			},
		})
		setUsers(users.filter((user) => user._id !== id))
	}

	return (
		<div className="main-container">
			<Link to="/">
				<img src={logo} alt="tindev" />
			</Link>
			{users.length > 0 ? (
				<ul>
					{users.map((user) => (
						<li key={user._id}>
							<img src={user.avatar} alt={user.name} />
							<footer>
								<strong>{user.name}</strong>
								<p>{user.bio}</p>
							</footer>
							<div className="buttons">
								<button type="button" onClick={() => handleDislike(user._id)}>
									<img src={dislike} alt="dislike" />
								</button>
								<button type="button" onClick={() => handleLike(user._id)}>
									<img src={like} alt="like" />
								</button>
							</div>
						</li>
					))}
				</ul>
			) : (
				<div className="empty">Come back soon!</div>
			)}
			{devMatch && (
				<div className="match-container">
					<img src={itsamatch} alt="it's a match" />
					<img className="avatar" src={devMatch.avatar} alt="liked user avatar" />
					<strong>{devMatch.name}</strong>
					<p>{devMatch.bio}</p>
					<button onClick={() => setDevMatch(null)} type="button">
						Close
					</button>
				</div>
			)}
		</div>
	)
}
export default List
