import type { ListFriend, ListRequestFriend } from "../types/user.types";
import { apiFriends, getToken } from "./client";

export const sendRequestBack = async (username: string): Promise<any | { error: string }> => {
	try {
		const response = await apiFriends.post("request",
			{ username: username },
			{
				headers: {
					Authorization: `Bearer ${getToken()}`
				}
			}
		);
		return (response.data);
	}
	catch (err: any) {
		if (err.response && err.response.data) {
			return { error: err.response.data.error || "Erreur inconnue" };
		}
		return { error: err.message || "Erreur réseau" };
	}
}
export const getRequestBack = async (): Promise<ListRequestFriend | { error: string }> => {
	try {
		const response = await apiFriends.get("request",
			{
				headers: {
					Authorization: `Bearer ${getToken()}`
				}
			}
		);
		return (response.data);
	}
	catch (err: any) {
		if (err.response && err.response.data) {
			return { error: err.response.data.error || "Erreur inconnue" };
		}
		return { error: err.message || "Erreur réseau" };
	}
}

export const delRequestBack = async (username: string): Promise<any | { error: string }> => {
	try {
		const response = await apiFriends.delete(`request/reject/${username}`,
			{
				headers: {
					Authorization: `Bearer ${getToken()}`
				}
			}
		);
		return (response.data);
	}
	catch (err: any) {
		if (err.response && err.response.data) {
			return { error: err.response.data.error || "Erreur inconnue" };
		}
		return { error: err.message || "Erreur réseau" };
	}
}

export const saveRequestBack = async (username: string): Promise<any | { error: string }> => {
	try {
		const response = await apiFriends.post("friends", {
			username: username
		},
			{
				headers: {
					Authorization: `Bearer ${getToken()}`
				}
			}
		);
		return (response.data);
	}
	catch (err: any) {
		if (err.response && err.response.data) {
			return { error: err.response.data.error || "Erreur inconnue" };
		}
		return { error: err.message || "Erreur réseau" };
	}
}

export const getFriendsBack = async (): Promise<ListFriend | { error: string }> => {
	try {
		const response = await apiFriends.get("friends",
			{
				headers: {
					Authorization: `Bearer ${getToken()}`
				}
			}
		);
		return (response.data);
	}
	catch (err: any) {
		if (err.response && err.response.data) {
			return { error: err.response.data.error || "Erreur inconnue" };
		}
		return { error: err.message || "Erreur réseau" };
	}
}

export const deleteFriendBack = async (username: string): Promise<any | { error: string }> => {
	try {
		const response = await apiFriends.delete(`${username}`,
			{
				headers: {
					Authorization: `Bearer ${getToken()}`
				}
			}
		);
		return (response.data);
	}
	catch (err: any) {
		if (err.response && err.response.data) {
			return { error: err.response.data.error || "Erreur inconnue" };
		}
		return { error: err.message || "Erreur réseau" };
	}
}