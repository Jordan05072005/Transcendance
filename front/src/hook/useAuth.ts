import { sendCodeBack } from './../api/auth.service';
import { useEffect, useState } from "react";
import { sendLoginBack, sendSignUpBack } from "../api/auth.service";
import { checkError } from "../utils/error";
import { useUser } from './useUser';
import { fetchDataUserBack, sendAvatar, sendLossUpdate, sendUpdateUser, sendVictoryUpdate, deleteUserBack } from '../api/user.service';
import { useNotification } from '../components/ui/Notification';
import { useTranslation } from "react-i18next"
import type { UpdateUser, UseAuthReturn, User, UserSignUp } from "../types/user.types";



export const useAuth = (): UseAuthReturn => {
	const [profilPage, SetProfilPage] = useState(false);
	const [DoubleAuthPage, setDoubleAuthPage] = useState(false);
	const [signupForm, SetSignUpForm] = useState<UserSignUp>({ username: "", email: "", password: "", isTwoFactorEnabled: false, });
	const { notify } = useNotification();
	const key = import.meta.env.VITE_JWT_KEY;
	const { user, setUser } = useUser();
	const { i18n, t } = useTranslation()


	const fetchDataUser = async () => {
		if (Object.values(user).some(value => !value)) {
			const response = await fetchDataUserBack();
			if (typeof response === "object" && 'error' in response) {
				checkError(response.error, user, setUser);
				sessionStorage.removeItem(key);
				return;
			}
			response.user.password = "......";
			response.user.login = true;
			setUser(response.user);
			i18n.changeLanguage(response.user.lang)
		}
	}

	const sendLogin = async (): Promise<boolean> => {
		if (signupForm.email == "" || signupForm.password == "") {
			notify(t("login.emptyField"), 'error');
			return false;
		}
		const response = await sendLoginBack({ email: signupForm.email, password: signupForm.password });
		if (!response) {
			setDoubleAuthPage(true);
			return true;
		}
		else if ('error' in response) {
			checkError(response.error, user, setUser);
			notify(t(response.error), 'error');
			return false;
		}
		sessionStorage.setItem(key, response.token);
		(user);
		setUser({ ...response.user, login: true });
		fetchDataUser();
		SetProfilPage(false);
		SetSignUpForm({ username: "", email: "", password: "", isTwoFactorEnabled: false });
		notify(t("login.login"), 'success');
		return true;
	}

	const deleteUser = async (id: number) => {
		const response = await deleteUserBack(id);
		if (response && typeof response === "object" && "error" in response) {
			checkError(response.error, user, setUser);
			notify(t(response.error), 'error');
			return;
		}
		notify(t("profile.delete"), 'success');
		logout(false);
		SetProfilPage(false);
	}

	const sendCode = async (code: string) => {
		const response = await sendCodeBack({
			user: { email: signupForm.email, password: signupForm.password },
			code: code
		});
		if (!(response && 'error' in response)) {
			sessionStorage.setItem(key, response.token);

			setUser({ ...user, login: true });
			setDoubleAuthPage(false);
			fetchDataUser();
			SetProfilPage(false);
			SetSignUpForm({ email: "", password: "", username: "", isTwoFactorEnabled: false });
			notify(t("login.login"), 'success');
			return;
		}
		checkError(response.error, user, setUser);
		notify(t(response.error), 'error');
	}

	const sendSignUp = async (): Promise<boolean> => {
		if (signupForm.email == "" || signupForm.password == "" || signupForm.username == "") {
			notify(t("signup.emptyField"), 'error');
			return false;
		}
		const response = await sendSignUpBack(signupForm);
		if (response && typeof response === "object" && "error" in response) {
			notify(t(response.error), 'error');
			return false;
		}

		await sendLogin();
		notify(t("signup.accountCreated"), 'success');
		return true;
	}

	function diffObjects(obj1: Record<string, any>, obj2: Record<string, any>) {
		const result: Record<string, any> = {};
		for (const key in obj1) {
			if (obj1[key] !== obj2[key]) {
				result[key] = obj2[key];
			}
		}
		result["password"] = undefined;
		return result;
	}

	const checkDataUpdate = (update: UpdateUser) => {
		const result: UpdateUser = { ...update }; // Copie de update
		const keys = Object.keys(user) as (keyof User)[];
		keys.forEach(key => {
			if (user[key] == result[key]) {
				result[key] = undefined;
			}
		});
		return result
	}

	const sendUpdate = async (updateUser: UpdateUser) => {
		if (updateUser.email == "" || updateUser.password == "" || updateUser.username == "")
			return (notify(t("profile.emptyField"), 'error'));
		updateUser = checkDataUpdate(updateUser);
		if ('avatar' in updateUser && updateUser.avatar)
			await sendAvatar(updateUser.avatar);
		const response = await sendUpdateUser(diffObjects(user, updateUser));
		if (response && typeof response === "object" && "error" in response) {
			checkError(response.error, user, setUser);
			//console.log(response.error);
			notify(t(response.error), 'error');
			return;
		}
		response.user.login = true;
		response.user.password = "....";
		//console.log(response.user)
		setUser(response.user);
		i18n.changeLanguage(response.user.lang)
		notify(t("profile.save"), 'success');
		return;
	}

	const sendVictory = async (updateUser: UpdateUser) => {
		if (updateUser.email == "" || updateUser.password == "" || updateUser.username == "")
			return (notify(t("profile.emptyField"), 'error'));
		updateUser = checkDataUpdate(updateUser);
		//console.log("up", updateUser);
		if ('avatar' in updateUser && updateUser.avatar)
			await sendAvatar(updateUser.avatar);
		const response = await sendVictoryUpdate(diffObjects(user, updateUser));
		if (response && typeof response === "object" && "error" in response) {
			checkError(response.error, user, setUser);
			notify(t(response.error), 'error');
			return;
		}
		response.user.login = true;
		response.user.password = "....";
		//console.log("user : ", response.user);
		setUser(response.user);
		//console.log(response.user);
		notify(t("profile.save"), 'success');
		return;
	}

	const sendLoss = async (updateUser: UpdateUser) => {
		if (updateUser.email == "" || updateUser.password == "" || updateUser.username == "")
			return (notify(t("profile.emptyField"), 'error'));
		updateUser = checkDataUpdate(updateUser);
		//console.log("up", updateUser);
		if ('avatar' in updateUser && updateUser.avatar)
			await sendAvatar(updateUser.avatar);
		const response = await sendLossUpdate(diffObjects(user, updateUser));
		if (response && typeof response === "object" && "error" in response) {
			checkError(response.error, user, setUser);
			notify(t(response.error), 'error');
			return;
		}
		response.user.login = true;
		response.user.password = "....";
		//console.log("user : ", response.user);
		setUser(response.user);
		//console.log(response.user);
		notify(t("profile.save"), 'success');
		return;
	}

	const logout = async (val: boolean) => {
		if (val)
			await sendUpdateUser({ login: false })
		sessionStorage.removeItem(key);
		setUser({ id: 0, username: "", email: "", password: "", isTwoFactorEnabled: false, nbrVictory: 0, nbrDefeat: 0, login: false, achivementDestroyer: false, achivementVictory: false, achivementLoss: false, friends: [], avatar: null, lang: "en" });
		notify(t("profile.logout"), 'info');
		i18n.changeLanguage("en");
	}
	return {
		profilPage,
		SetProfilPage,
		signupForm,
		SetSignUpForm,
		fetchDataUser,
		sendLogin,
		sendSignUp,
		sendUpdate,
		sendVictory,
		sendLoss,
		sendCode,
		DoubleAuthPage,
		setDoubleAuthPage,
		logout,
		deleteUser
	}
}