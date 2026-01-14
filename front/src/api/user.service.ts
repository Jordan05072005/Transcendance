import type { UpdateUser, User } from "../types/user.types";
import { apiUser, getToken } from "./client";

export const fetchDataUserBack = async() :Promise<{user: User} | { error: string }> =>{
	try{
		const response = await apiUser.get("users",
			{
				headers: {
					Authorization: `Bearer ${getToken()}`
				}
			}
		);
		//console.log(response);
		return (response.data);
	}
	catch(err: any){
		if (err.response && err.response.data) {
			return { error: err.response.data.error || "Erreur inconnue" };
		}
		return { error: err.message || "Erreur réseau" };
	}
}

export const sendUpdateUser = async(user: UpdateUser) :Promise<{user: User} | { error: string }> =>{
	try{
		const response = await apiUser.patch("users",
			user,
			{
				headers: {
					Authorization: `Bearer ${getToken()}`
				}
			}
		);
		return (response.data);
	}
	catch(err: any){
		if (err.response && err.response.data) {
			return { error: err.response.data.error || "Erreur inconnue" };
		}
		return { error: err.message || "Erreur réseau" };
	}
}

export const sendVictoryUpdate = async(user: UpdateUser) :Promise<{user: User} | { error: string }> =>{
	try{
		const response = await apiUser.patch("users/victory",
			user,
			{
				headers: {
					Authorization: `Bearer ${getToken()}`
				}
			}
		);
		return (response.data);
	}
	catch(err: any){
		if (err.response && err.response.data) {
			return { error: err.response.data.error || "Erreur inconnue" };
		}
		return { error: err.message || "Erreur réseau" };
	}
}

export const sendLossUpdate = async(user: UpdateUser) :Promise<{user: User} | { error: string }> =>{
	try{
		const response = await apiUser.patch("users/loss",
			user,
			{
				headers: {
					Authorization: `Bearer ${getToken()}`
				}
			}
		);
		return (response.data);
	}
	catch(err: any){
		if (err.response && err.response.data) {
			return { error: err.response.data.error || "Erreur inconnue" };
		}
		return { error: err.message || "Erreur réseau" };
	}
}

export const sendAvatar = async(file: File) :Promise<{user: User} | { error: string }> =>{
	const formData = new FormData();
	//console.log("file:" ,file);
	formData.append('avatar', file);
	try{
		const response = await apiUser.patch("users/avatar",
			formData,
			{
				headers: {
					Authorization: `Bearer ${getToken()}`
				}
			}
		);
		return (response.data);
	}
	catch(err: any){
		if (err.response && err.response.data) {
			return { error: err.response.data.error || "Erreur inconnue" };
		}
		return { error: err.message || "Erreur réseau" };
	}
}

export const deleteUser = async(id: number) => {
	try {
		const response = await apiUser.delete(`users/deletion/${id}`,
			{
				headers: {
					Authorization: `Bearer ${getToken()}`
				}
			}
		)
		return response
	}
	catch(err: any){
		if (err.response && err.response.data) {
			return { error: err.response.data.error || "Erreur inconnue" };
		}
	return { error: err.message || "Erreur réseau" };
	}
}

export const deleteUserBack = async(id: number) => {
	try {
		const response = await apiUser.delete(`users/deletion/${id}`,
			{
				headers: {
					Authorization: `Bearer ${getToken()}`
				}
			}
		)
		return response
	}
	catch(err: any){
		if (err.response && err.response.data) {
			return { error: err.response.data.error || "Erreur inconnue" };
		}
	return { error: err.message || "Erreur réseau" };
	}
}