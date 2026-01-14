import { useState, useEffect, useMemo } from "react";
import { FriendRequestCard } from "./components/FriendRequestCard";
import { FriendCard } from "./components/FriendCard";
import { useUser } from "./hook/useUser";
import { useTranslation } from "react-i18next";
import Card from "./components/ui/VhsCard";
import type { UseFriendReturn, Friend } from "./types/user.types";

interface LeaderboardEntry {
	username: string;
	victories: number;
	defeats: number;
	isCurrentUser: boolean;
}

const validateUsername = (username: string): string | null => {
	if (!username || username.trim().length === 0) return null;
	if (username.length < 3) return "Username must be at least 3 characters";
	if (username.length > 20) return "Username must be less than 20 characters";
	if (!/^[a-zA-Z0-9_]+$/.test(username)) return "Username can only contain letters, numbers, and underscores";
	return null;
};

function BodyRequest({ friends }: { friends: UseFriendReturn }) {
	const [username, setUsername] = useState("");
	const [usernameError, setUsernameError] = useState<string | null>(null);
	const { t } = useTranslation();

	const handleUsernameChange = (value: string) => {
		setUsername(value);
		setUsernameError(validateUsername(value));
	};

	const handleSendRequest = () => {
		if (username.trim() === "") return;

		const error = validateUsername(username);
		if (error) {
			setUsernameError(error);
			return;
		}

		friends.sendRequest(username);
		friends.getRequest();
		setUsername("");
		setUsernameError(null);
	};

	return (
		<>
			<div className="w-full flex flex-col gap-1.5 font-mono">
				<div className="text-[0.9rem] opacity-80">{t("friend.username")} {'>'}</div>
				<div className="flex gap-2.5">
					<input
						name="text"
						type="text"
						value={username}
						maxLength={20}
						placeholder={t("friend.username")}
						onChange={(e) => handleUsernameChange(e.target.value)}
						className={`bg-black border text-[#33ff00] font-mono text-[1.1rem] py-2 px-4 outline-none shadow-[inset_0_0_10px_rgba(51,255,0,0.1)] flex-1 box-border focus:shadow-[inset_0_0_15px_rgba(51,255,0,0.3)] focus:bg-[#051a05] ${usernameError ? 'border-[#ff3333]' : 'border-[#33ff00]'}`}
					/>
					<button
						onClick={handleSendRequest}
						disabled={!!usernameError || username.trim() === ""}
						className={`font-mono font-bold text-[1.1rem] text-[#33ff00] uppercase bg-black py-2 px-4 border border-[#33ff00] shadow-[4px_4px_0px_rgba(51,255,0,0.2)] cursor-pointer transition-all hover:opacity-80 hover:translate-x-0.5 hover:translate-y-0.5 ${(usernameError || username.trim() === "") ? 'opacity-50 cursor-not-allowed' : ''}`}
					>
						{t("friend.send")}
					</button>
				</div>
				{usernameError && <p className="text-[#ff3333] text-[0.8rem] mt-1">{usernameError}</p>}
			</div>

			{friends.listRequest && friends.listRequest.length > 0 && (
				<div className="w-full mt-2.5">
					<div className="text-[0.9rem] opacity-80">{t("friend.pendingRequests")}</div>
					<div className="max-h-[150px] overflow-y-auto border border-[#33ff00] p-2.5 mt-1.5">
						{friends.listRequest.map((username) => (
							<FriendRequestCard
								key={username}
								username={username}
								onAccept={() => friends.saveRequest(username)}
								onReject={() => friends.delRequest(username)}
							/>
						))}
					</div>
				</div>
			)}
		</>
	);
}

function Leaderboard() {
	const { user } = useUser();
	const { t } = useTranslation();

	const leaderboard = useMemo((): LeaderboardEntry[] => {
		const entries: LeaderboardEntry[] = [];

		if (user.username) {
			entries.push({
				username: user.username,
				victories: user.nbrVictory || 0,
				defeats: user.nbrDefeat || 0,
				isCurrentUser: true
			});
		}

		if (user.friends) {
			user.friends.forEach((friend: Friend) => {
				entries.push({
					username: friend.username,
					victories: friend.nbrVictory || 0,
					defeats: friend.nbrDefeat || 0,
					isCurrentUser: false
				});
			});
		}

		return entries.sort((a, b) => b.victories - a.victories);
	}, [user]);

	return (
		<div className="w-full">
			<div className="text-[0.9rem] opacity-80 mb-1.5">{t("friend.leaderboard")}</div>
			<div className="max-h-[200px] overflow-y-auto border border-[#33ff00] p-2.5">
				{leaderboard.length === 0 ? (
					<p className="opacity-50 text-center py-2">{t("friend.noData")}</p>
				) : (
					leaderboard.map((entry: LeaderboardEntry, i: number) => (
						<div
							key={i}
							className={`flex items-center justify-between py-1.5 border-b border-[rgba(51,255,0,0.2)] last:border-b-0 ${entry.isCurrentUser ? 'text-[#ffd700]' : 'text-[#33ff00]'}`}
						>
							<div className="flex items-center gap-2">
								<span className="font-bold text-[0.9rem] w-6">{i + 1}.</span>
								<span className="font-mono text-[0.85rem]">
									{entry.username} {entry.isCurrentUser && t("friend.you")}
								</span>
							</div>
							<div className="flex gap-3 text-[0.75rem]">
								<span className="text-green-400">W:{entry.victories}</span>
								<span className="text-red-400">L:{entry.defeats}</span>
							</div>
						</div>
					))
				)}
			</div>
		</div>
	);
}

export default function FriendsPage({ friends }: { friends: UseFriendReturn }) {
	const [view, setView] = useState<"search" | "friends">("friends");
	const [showLeaderboard, setShowLeaderboard] = useState(false);
	const { t } = useTranslation();
	const { user } = useUser();
	const hasFriends = user.friends && user.friends.length > 0;

	useEffect(() => {
		let interval: ReturnType<typeof setInterval>;

		const startPolling = () => {
			interval = setInterval(() => {
				if (document.visibilityState === 'visible') {
					friends.getRequest();
					friends.getFriend();
				}
			}, 10000);
		};

		startPolling();

		return () => clearInterval(interval);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [friends]);

	return (
		<div className="fixed top-0 left-0 right-0 bottom-0 z-[100] flex items-center justify-center">
			<div className="absolute top-0 left-0 right-0 bottom-0 bg-black/80"></div>

			<div className="relative bg-black/80 flex items-center justify-center p-4">
				<div className="relative">
					<Card className="flex flex-col items-center gap-4 bg-[rgba(10,10,10,0.9)] border border-[#33ff00] p-[30px_40px] shadow-[0_0_40px_rgba(0,0,0,1),6px_6px_0px_rgba(51,255,0,0.2)] w-[400px] z-[60] max-h-[80vh] overflow-y-auto">

						<div className="w-full border-b-2 border-[#33ff00] pb-2 mb-2 flex items-center justify-between">
							<div className="text-xl uppercase tracking-[2px] animate-text-flicker flex-1 text-center">
								{view === "search" ? t("friend.friendSearch") : t("friend.friend")}
							</div>
							{view === "friends" && (
								<button
									onClick={() => setShowLeaderboard(!showLeaderboard)}
									className={`cursor-pointer transition-all hover:scale-110 ${showLeaderboard ? 'text-[#ffd700]' : 'text-[#33ff00]'}`}
									title={t("friend.leaderboard")}
								>
									<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
										<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
										<path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
										<path d="M4 22h16" />
										<path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
										<path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
										<path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
									</svg>
								</button>
							)}
						</div>

						{view === "search" && <BodyRequest friends={friends} />}

						{view === "friends" && (
							<div className="w-full">
								<div className="max-h-[200px] overflow-y-auto border border-[#33ff00] p-2.5">
									{hasFriends && user.friends.map((friend) => (
										<FriendCard key={friend.username} username={friend.username} login={friend.login} onDelete={() => friends.deleteFriend(friend.username)} />
									))}
									{!hasFriends && (
										<p className="opacity-50 text-center py-2">{t("friend.noFriends")}</p>
									)}
									<button
										className="font-mono font-bold text-[0.75rem] text-[#33ff00] uppercase bg-black py-1 px-2 border border-[#33ff00] cursor-pointer transition-all hover:opacity-80 hover:bg-[#33ff00] hover:text-black mt-2 w-full"
										onClick={() => setView("search")}
									>
										+ {t("friend.friendSearch")}
									</button>
								</div>
							</div>
						)}

						<div className="w-full mt-2 pt-3 border-t border-[rgba(51,255,0,0.3)]">
							<button
								className="font-mono font-bold text-[1rem] uppercase bg-black py-2 px-4 border cursor-pointer transition-all hover:opacity-80 w-full justify-center border-[#2a9d8f] text-[#2a9d8f] hover:bg-[#2a9d8f] hover:text-black"
								onClick={() => view === "search" ? setView("friends") : friends.openFriendPage(false)}
							>
								{view === "search" ? t("friend.back") : t("profile.exit")}
							</button>
						</div>
					</Card>

					{showLeaderboard && (
						<div className="mt-4 xl:mt-0 xl:absolute xl:left-[calc(100%+16px)] xl:top-0 xl:h-full w-full xl:w-auto">
							<Card className="flex flex-col items-center gap-2 sm:gap-4 bg-[rgba(10,10,10,0.9)] border border-[#33ff00] p-[20px_25px] sm:p-[30px_40px] shadow-[0_0_40px_rgba(0,0,0,1),6px_6px_0px_rgba(51,255,0,0.2)] w-full xl:w-[350px] xl:h-full z-[60] max-h-[50vh] xl:max-h-[80vh] overflow-y-auto">
								<div className="w-full border-b-2 border-[#33ff00] pb-2 mb-2">
									<div className="text-lg sm:text-xl uppercase tracking-[2px] animate-text-flicker text-center">
										{t("friend.leaderboard")}
									</div>
								</div>
								<Leaderboard />
							</Card>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
