import { useState, useRef } from "react";
import { getRequestBack, sendRequestBack, saveRequestBack, delRequestBack, getFriendsBack, deleteFriendBack } from "../api/friend.service";
import type { UseFriendReturn } from "../types/user.types";
import { checkError } from "../utils/error";
import { useUser } from "./useUser";
import { useNotification } from "../components/ui/Notification";
import { useTranslation } from "react-i18next";

export const useFriends = (): UseFriendReturn => {

	const [friendsPage, setFriendsPage] = useState(false);
	const [listRequest, setListRequest] = useState<string[]>([]);
	const { user, setUser } = useUser();
	const { notify } = useNotification();
	const { t } = useTranslation()
	const prevRequestCount = useRef<number>(0);
	const prevFriendCount = useRef<number>(0);
	const isInitialized = useRef<boolean>(false);


	const sendRequest = async (username: string) => {
		const response = await sendRequestBack(username);
		if (response && 'error' in response) {
			checkError(response.error, user, setUser);
			return (notify(t(response.error), 'error'));
		}
		notify(t("friend.requestSent"), 'success');
	}

	const getRequest = async () => {
		const response = await getRequestBack();
		if (response && 'error' in response) {
			checkError(response.error, user, setUser);
			return;
		}
		if (isInitialized.current && response.users.length > prevRequestCount.current) {
			const newCount = response.users.length - prevRequestCount.current;
			notify(t("friend.newRequest", { count: newCount }), 'info');
		}
		prevRequestCount.current = response.users.length;
		setListRequest(response.users);
	}

	const getFriend = async () => {
		const response = await getFriendsBack();
		if (response && 'error' in response) {
			checkError(response.error, user, setUser);
			return;
		}
		if (isInitialized.current && response.friends.length > prevFriendCount.current) {
			notify(t("friend.requestAcceptedByOther"), 'success');
		}
		prevFriendCount.current = response.friends.length;
		setUser({ ...user, friends: response.friends });
	}

	const saveRequest = async (username: string) => {
		const response = await saveRequestBack(username);
		if (response && 'error' in response) {
			checkError(response.error, user, setUser);
			return (notify(t(response.error), 'error'));
		}
		notify(t("friend.requestAccepted"), 'success');
		//getFriend();
		setListRequest(prev => prev.filter(u => u !== username));
	}

	const delRequest = async (username: string) => {
		const response = await delRequestBack(username);
		if (response && 'error' in response) {
			checkError(response.error, user, setUser);
			return (notify(t(response.error), 'error'));
		}
		notify(t("friend.requestDeclined"), 'success');
		setListRequest(prev => prev.filter(u => u !== username));
	}

	const deleteFriend = async (username: string) => {
		const response = await deleteFriendBack(username);
		if (response && 'error' in response) {
			checkError(response.error, user, setUser);
			return (notify(t(response.error), 'error'));
		}
		notify(t("friend.friendDeleted"), 'success');
		setUser({ ...user, friends: user.friends.filter(f => f.username !== username) });
	}

	const openFriendPage = async (state: boolean) => {
		if (state) {
			const [requestRes, friendRes] = await Promise.all([
				getRequestBack(),
				getFriendsBack()
			]);
			if (requestRes && !('error' in requestRes)) {
				prevRequestCount.current = requestRes.users.length;
				setListRequest(requestRes.users);
			}
			if (friendRes && !('error' in friendRes)) {
				prevFriendCount.current = friendRes.friends.length;
				setUser({ ...user, friends: friendRes.friends });
			}
			isInitialized.current = true;
		} else {
			isInitialized.current = false;
		}
		setFriendsPage(state);
	}
	return {
		friendsPage,
		openFriendPage,
		sendRequest,
		getRequest,
		getFriend,
		listRequest,
		saveRequest,
		delRequest,
		deleteFriend,
	}
}