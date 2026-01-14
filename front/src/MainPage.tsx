import Pong from './components/Pong'
import Background from './components/ui/Background.tsx';
import Footer from './components/ui/Footer.tsx';
import LoginButton from './components/ui/LoginButton.tsx';
import ModeSwitch from './components/ui/ModeSwitch.tsx';
import Instructions from './components/ui/Instructions.tsx';
import AuthPage from './Auth.tsx';
import FriendsPage from './Friend.tsx';
import ProfilePage from './Profile.tsx';
import TournamentForm from './components/gamemode/TournamentForm.tsx';
import TournamentBracket from './components/gamemode/TournamentBracket.tsx';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from "./hook/useAuth.ts";
import { useFriends } from './hook/useFriends.ts';
import { useAchivements, useUser } from './hook/useUser.tsx';
import { FriendButton } from './components/FriendButton.tsx';
import { useNotification } from './components/ui/Notification.tsx';
import { useMatchHistory } from './hook/useMatchHistory.ts';
import { useTranslation } from 'react-i18next';
import type { User } from './types/user.types.ts';
import type { GameMode } from './components/gamemode/GameMode.tsx';
import { getToken } from './api/client.ts';

function MainPage() {
	const auth = useAuth();
	const friends = useFriends();
	const { user, setUser } = useUser();
	const { notify } = useNotification();
	const { t } = useTranslation()
	const achivements = useAchivements();
	const [choiceForm, setChoiceForm] = useState(0);
	const [mode, setMode] = useState<GameMode | "tournamentForm">("duel");
	const [tournamentPlayers, setTournamentPlayers] = useState<string[]>([]);
	const [winners, setWinners] = useState<string[]>([]);
	const [score, setScore] = useState<number[]>([]);
	const [gameOngoing, setGameOngoing] = useState<boolean>(false);
	const [isSystemLoading, setIsSystemLoading] = useState<boolean>(true);
	const achivementLossEarned = useRef(false);
	const achivementVictoryEarned = useRef(false);
	const achivementDestroyerEarned = useRef(false);

	const setupTournament = (players: string[]) => {
		const allPlayers = [...players];
		setTournamentPlayers(allPlayers);
		setMode("tournament");
		setWinners([]);
		setScore([]);
	};

	const endTournament = (user: User, winners: string[]) => {
		(`user = ${user.login} | username = ${user.username} | winner = ${winners.length}`)
		setTournamentPlayers([]);
		setWinners([]);
		setScore([]);
		setMode("duel");
	}

	const closeTournamentForm = () => {
		setMode("duel");
		setTournamentPlayers([]);
	};

	const handleModeChange = (newMode: GameMode) => {
		if (!gameOngoing)
			setMode(newMode);
	};

	useEffect(() => {
		const achivementUpdate = () => {

			if (!user || !user.email || !auth)
				return;

			if (user.nbrVictory === 1 && !user.achivementVictory && achivementVictoryEarned.current === false) {
				//console.log(`achivementsVictory: ${user.nbrVictory} && ${user.achivementVictory} && ${achivementVictoryEarned.current}`)
				notify(`${t("mainPage.achievementEarned")} +100xp`, "success");
				achivements.addAchivementVictory();
				achivementVictoryEarned.current = true
			}
			else if (user.nbrDefeat === 1 && !user.achivementLoss && achivementLossEarned.current === false) {
				//console.log(`achivementsLoss: ${user.nbrDefeat} && ${user.achivementLoss} && ${achivementLossEarned.current}`)
				notify(`${t("mainPage.achievementEarned")} +100xp`, "success");
				achivements.addAchivementLoss();
				achivementLossEarned.current = true
			}
			else if (user.nbrVictory === 5 && !user.achivementDestroyer && achivementDestroyerEarned.current === false) {
				//console.log(`achivementsDestroyer: ${user.nbrVictory} && ${user.achivementDestroyer} && ${achivementDestroyerEarned.current}`)
				notify(`${t("mainPage.achievementEarned")} +100xp`, "success");
				achivements.addAchivementDestroy();
				achivementDestroyerEarned.current = true
			}
		}
		achivementUpdate();
	}, [user, score])

	useEffect(() => {
		const achivementUpdate = async () => {
			const savedToken = getToken();
			if (savedToken) {
				await auth.fetchDataUser();
			}
			else {
				setUser({ ...user, login: false });
			}
		}
		achivementUpdate();
	}, []);
	return (
		<div id="main-wrapper" className="relative flex flex-col items-center justify-center w-screen h-screen bg-transparent">
			<Background isPaused={friends.friendsPage || auth.profilPage || mode === "tournamentForm"} />
			{!isSystemLoading && (
				<>
					<div className="absolute top-[30px] left-[30px] z-50">
						<LoginButton onClick={() => auth.SetProfilPage(true)} username={user.login ? user.username : undefined} />
					</div>
					{user.login && (
						<div className="absolute top-[30px] right-[30px] z-50">
							<FriendButton onClick={() => friends.openFriendPage(true)} />
						</div>
					)}
				</>
			)}

			<div className="flex flex-col items-center justify-center z-10">
				{!isSystemLoading && (
					<div className="flex items-center gap-4 mb-[25px]">
						<ModeSwitch
							mode={mode}
							onModeChange={handleModeChange}
							disabled={gameOngoing || mode === "tournament"}
						/>
						<button
							className={`${gameOngoing || mode === "tournament" ? 'opacity-[0.4] cursor-not-allowed' : 'opacity-[1] cursor-pointer'} font-mono font-bold text-[1.1rem] text-[#33ff00] uppercase bg-black py-2 px-4 border border-[#33ff00] shadow-[4px_4px_0px_rgba(51,255,0,0.2)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 h-fit`}
							onClick={() => !gameOngoing && mode !== "tournament" && setMode('tournamentForm')}
						>
							{t("mainPage.tournament")}
						</button>
					</div>
				)}

				{mode === "tournamentForm" && (
					<TournamentForm onClose={closeTournamentForm} onValidate={setupTournament} />
				)}

				<Pong
					tournamentPlayers={tournamentPlayers}
					gameMode={mode}
					addWinners={(win) => { setWinners((prev) => [...prev, win]); }}
					endTournament={endTournament}
					addScore={(left, right) => { setScore((scor: number[]) => [...scor, left, right]); }}
					setOngoingGame={setGameOngoing}
					winners={winners}
					onLoadingChange={setIsSystemLoading}
				/>

				{!isSystemLoading && <Instructions />}

				{mode === "tournament" && tournamentPlayers.length === 4 && (
					<TournamentBracket players={tournamentPlayers} winners={winners} />
				)}
			</div>

			{auth.profilPage && (user?.login == false) && (
				<AuthPage auth={auth} choiceForm={choiceForm} setChoiceForm={setChoiceForm} />
			)}

			{friends.friendsPage && (user?.login) && (
				<FriendsPage friends={friends} />
			)}

			{auth.profilPage && user?.login && (
				<ProfilePage auth={auth} />
			)}

			<Footer />
		</div>
	);
}

export default MainPage