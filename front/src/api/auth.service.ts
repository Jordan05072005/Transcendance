import type { ResponseLogin, User, UserLogin, UserSignUp } from "../types/user.types";
import api from "./client"

export const sendLoginBack = async (user: UserLogin): Promise<null | ResponseLogin | { error: string }> => {
	try {
		const response = await api.post("login", user);
		return (response.data);
	}
	catch (err: any) {
		if (err.response && err.response.data) {
			return { error: err.response.data.error || "Erreur inconnue" };
		}
		return { error: err.message || "Erreur réseau" };
	}
}

export const sendCodeBack = async ({ user, code }: { user: UserLogin, code: string })
	: Promise<ResponseLogin | { error: string }> => {
	try {
		const response = await api.post("/login/twoFactor", { email: user.email, password: user.password, code: code });
		return (response.data);
	}
	catch (err: any) {
		if (err.response && err.response.data) {
			return { error: err.response.data.error || "Erreur inconnue" };
		}
		return { error: err.message || "Erreur réseau" };
	}
}

export const sendSignUpBack = async (user: UserSignUp): Promise<User | { error: string }> => {
	try {
		//console.log(user);
		const response = await api.post("signup", user);
		return (response.data);
	}
	catch (err: any) {
		if (err.response && err.response.data) {
			return { error: err.response.data.error || "Erreur inconnue" };
		}
		return { error: err.message || "Erreur réseau" };
	}
}

