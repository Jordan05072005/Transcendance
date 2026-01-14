import axios from "axios";


const api = axios.create({
	baseURL: "/auth",
  headers: { "Content-Type": "application/json" },
});

export const apiUser = axios.create({
	baseURL: "/users",
});

export const apiFriends = axios.create({
	baseURL: "/friends",
  headers: { "Content-Type": "application/json" },
});

export const apiMatch = axios.create({
	baseURL: "/matches",
	headers: { "Content-Type": "application/json" },
});


export const getToken = () =>{
	const key = import.meta.env.VITE_JWT_KEY;
	
	//console.log("key:", key);
	const token = sessionStorage.getItem(key);
	//console.log(token);
	if (token)
		return token
}

export function setAuthToken(token?: string) {
  if (token) api.defaults.headers.Authorization = `Bearer ${token}`;
  else delete api.defaults.headers.Authorization;
}

export default api;
