import axios from "axios"

const api = axios.create({
	baseURL: "https://tindev-server.herokuapp.com/",
})

export default api
