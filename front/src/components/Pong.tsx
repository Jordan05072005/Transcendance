import { useEffect, useRef, useState } from "react";
import type { GameMode } from "./gamemode/GameMode";
import type { User } from "../types/user.types";
import { useUser } from "../hook/useUser";
import { useMatchHistory } from "../hook/useMatchHistory";
import { useNotification } from "./ui/Notification";
import { useTournaments } from "../hook/useTournaments";
import Card from "./ui/VhsCard";
import { useTranslation } from "react-i18next";

const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
function playBeep(freq = 440, type: OscillatorType = 'square', duration = 0.1, vol = 0.05) {
	if (audioCtx.state === 'suspended') audioCtx.resume();
	const osc = audioCtx.createOscillator();
	const gain = audioCtx.createGain();
	osc.type = type;
	osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
	gain.gain.setValueAtTime(vol, audioCtx.currentTime);
	gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
	osc.connect(gain);
	gain.connect(audioCtx.destination);
	osc.start();
	osc.stop(audioCtx.currentTime + duration);
}

interface PongGameParam {
	gameMode: GameMode | "tournamentForm";
	tournamentPlayers: string[];
	addWinners: (win: string) => void;
	endTournament: (user: User, winners: string[], is_player: boolean) => void;
	addScore: (left: number, right: number) => void;
	setOngoingGame: (status: boolean) => void
	winners: string[];
	onLoadingChange?: (isLoading: boolean) => void;
}

export default function Pong({ tournamentPlayers, gameMode, addWinners, endTournament, addScore, setOngoingGame, winners, onLoadingChange }: PongGameParam) {
	const screenRef = useRef<HTMLDivElement>(null);

	const { recordMatch } = useMatchHistory();
	const tournaments = useTournaments();

	const CHAR_EMPTY = ' ';
	const ROWS = 24;
	const COLS = 50;

	const staticTemplate = useRef<string[][] | null>(null);

	

	const buildStaticTemplate = () => {
		const template: string[][] = [];
		for (let y = 0; y < ROWS; y++) {
			const row: string[] = [];
			for (let x = 0; x < COLS; x++) {
				let char = CHAR_EMPTY;
				if (y === 0 || y === ROWS - 1) {
					if (x === 0 || x === COLS - 1) char = '+';
					else char = '-';
				}
				else if (x === 0 || x === COLS - 1) char = '|';
				else if (x === Math.floor(COLS / 2)) char = (y % 1 === 0) ? ':' : ' ';
				row.push(char);
			}
			template.push(row);
		}
		return template;
	};

	const ballX = useRef(300);
	const ballY = useRef(200);
	const ballR = 8;

	const ballSpeedX = useRef(1);
	const ballSpeedY = useRef(1);

	const paddleLeftY = useRef(150);
	const paddleLeftX = 10;
	const paddleRightY = useRef(150);
	const paddleHeight = 80;
	const paddleWidth = 10;
	const paddleSpeed = 2;

	var i = useRef(0)
	var add = useRef(0)
	var j = useRef(0)
	var sub = useRef(0)
	var width = useRef(0)
	var flag = useRef(0)
	var ticks = useRef(0)
	var ticks_count = useRef(0)
	var tournament = useRef(false);
	var wins_left = useRef(0);
	var wins_right = useRef(0);
	const [score_left, setScoreLeft] = useState<number>(0);
	const [score_right, setScoreRight] = useState<number>(0);

	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [loadingDots, setLoadingDots] = useState<string>(".");
	const { notify } = useNotification();
	const { i18n, t } = useTranslation()

	const translations = useRef({
		pressSpace: t("pong.pressSpace"),
		cpu: t("pong.Cpu"),
		tournament: t("pong.modeTournament"),
		vs: t("pong.modeVs"),
		won: t("pong.won"),
		wonTournament: t("pong.wonTournament"),
		victory: t("pong.victory"),
		wonLeft: t("pong.wonLeft"),
		wonRight: t("pong.wonRight"),
		defeat: t("pong.defeate"),
		tournamentStarted: t("pong.tournamentStarted"),
		currentMatch: t("pong.currentMatch"),
		loading: t("pong.loading")
	});

	useEffect(() => {
		translations.current = {
			pressSpace: t("pong.pressSpace"),
			cpu: t("pong.Cpu"),
			tournament: t("pong.modeTournament"),
			vs: t("pong.modeVs"),
			won: t("pong.won"),
			wonTournament: t("pong.wonTournament"),
			victory: t("pong.victory"),
			wonLeft: t("pong.wonLeft"),
			wonRight: t("pong.wonRight"),
			defeat: t("pong.defeate"),
			tournamentStarted: t("pong.tournamentStarted"),
			currentMatch: t("pong.currentMatch"),
			loading: t("pong.loading")
		};
		renderAscii();
	}, [i18n.language, t]);


	const userRef = useRef<User | null>(null);
	const { user } = useUser();

	useEffect(() => {
		userRef.current = user;
	}, [user]);

	var is_player = useRef(false);
	var player_pos = useRef(0);
	var tournament_versus = useRef<string>(null);

	const winnersRef = useRef<string[]>([]);
	useEffect(() => {
		winnersRef.current = winners;
	}, [winners]);

	const keys = useRef({
		ArrowUp: false,
		ArrowDown: false,
		w: false,
		s: false,
		Space: false,
	});

	const [match, setMatch] = useState("Free play");

	const ia_playing = useRef(false)


	useEffect(() => {
		if (!tournament.current && !ia_playing.current && gameMode == "ia" && Math.abs(ballSpeedX.current) == 1) {
			setMatch(`You against THE AI`)
			ia_playing.current = true
		}
		else if (!tournament.current && gameMode == "duel" && Math.abs(ballSpeedX.current) == 1) {
			ia_playing.current = false
			setMatch(`Free play`)
		}
		else if (!tournament.current && gameMode == "tournament" && Math.abs(ballSpeedX.current) == 1)
			ia_playing.current = false
		wins_left.current = 0;
		wins_right.current = 0;
		setScoreLeft(0);
		setScoreRight(0);
	}, [gameMode])
	const AIPlaying = () => {
		if (ia_playing.current) {
			if (ballSpeedX.current < 0) {
				ticks_count.current = 0
				flag.current = 0
				ticks.current = 0
			}
			i.current = 0
			j.current = 0
			if (ballSpeedY.current > 0 && ballSpeedX.current > 0 && (flag.current == 0 || flag.current == 1)) {
				keys.current.ArrowDown = false
				keys.current.ArrowUp = false
				flag.current = 1
				add.current = ballY.current
				width.current = ballX.current
				while (add.current < 400) {
					add.current += ballSpeedY.current
					width.current += ballSpeedX.current
					i.current++;
				}
				while (width.current < 600 && add.current > 0) {
					width.current += ballSpeedX.current
					add.current -= ballSpeedY.current
				}
				while (width.current < 600) {
					width.current += ballSpeedX.current
					add.current += ballSpeedY.current
				}
				if (paddleRightY.current > add.current && i.current < 300) {
					ticks.current = Math.ceil((paddleRightY.current - add.current + 35) / 2)
					keys.current.ArrowUp = true
					flag.current = 3
				}
				else if (paddleRightY.current + 80 < add.current && i.current < 300) {
					ticks.current = Math.floor((add.current - paddleRightY.current - 35) / 2)
					keys.current.ArrowDown = true
					flag.current = 3
				}
			}
			if (ballSpeedY.current < 0 && ballSpeedX.current > 0 && (flag.current == 0 || flag.current == 2)) {
				keys.current.ArrowDown = false
				keys.current.ArrowUp = false
				flag.current = 2
				sub.current = ballY.current
				width.current = ballX.current
				while (sub.current > 0) {
					sub.current += ballSpeedY.current
					width.current += ballSpeedX.current
					j.current++;
				}
				while (width.current < 600 && sub.current < 400) {
					width.current += ballSpeedX.current
					sub.current -= ballSpeedY.current
				}
				while (width.current < 600) {
					width.current += ballSpeedX.current
					sub.current += ballSpeedY.current
				}
				if (paddleRightY.current > sub.current && j.current < 300) {
					ticks.current = Math.ceil((paddleRightY.current - sub.current + 35) / 2)
					keys.current.ArrowUp = true
					flag.current = 3
				}
				else if (paddleRightY.current + 80 < sub.current && j.current < 300) {
					ticks.current = Math.floor((sub.current - paddleRightY.current - 35) / 2)
					keys.current.ArrowDown = true
					flag.current = 3
				}
			}
		}
	}

	/* pseudo-random */
	function Random() {
		if (Math.random() > 0.5)
			return (1);
		return (-1);
	}

	/* Tournament */
	const players = useRef({
		P1: false,
		P2: false,
		P3: false,
		P4: false
	})

	var match_players = useRef(-1);

	const P1Ref = useRef<string>(null);
	const P2Ref = useRef<string>(null);
	const P3Ref = useRef<string>(null);
	const P4Ref = useRef<string>(null);


	useEffect(() => {
		if (!tournament.current && tournamentPlayers && tournamentPlayers.length === 4
			&& Math.abs(ballSpeedX.current) == 1) {
			tournament.current = true;
			const [P1, P2, P3, P4] = tournamentPlayers;

			for (let i = 0; i < 4; i++) {
				if (tournamentPlayers[i] === userRef.current?.username) {
					is_player.current = true;
					player_pos.current = i + 1;
				}
			}

			P1Ref.current = P1;
			P2Ref.current = P2;
			P3Ref.current = P3;
			P4Ref.current = P4;

			players.current.P1 = false;
			players.current.P2 = false;
			players.current.P3 = false;
			players.current.P4 = false;

			setMatch(`${P1} vs ${P2}`);
			notify(translations.current.tournamentStarted, 'info');
			wins_left.current = 0;
			wins_right.current = 0;
			setScoreLeft(0);
			setScoreRight(0);
		}
	}, [tournamentPlayers]);

	function renderAscii() {
		if (!screenRef.current) return;

		if (!staticTemplate.current) {
			staticTemplate.current = buildStaticTemplate();
		}

		const scaleX = COLS / 600;
		const scaleY = ROWS / 400;

		const bX = Math.floor(ballX.current * scaleX);
		const bY = Math.floor(ballY.current * scaleY);

		const p1Y = Math.floor(paddleLeftY.current * scaleY);
		const p1H = Math.ceil(paddleHeight * scaleY);

		const p2Y = Math.floor(paddleRightY.current * scaleY);
		const p2H = Math.ceil(paddleHeight * scaleY);

		const rows: string[][] = [];
		for (let y = 0; y < ROWS; y++) {
			const row = [...staticTemplate.current[y]];

			if (y >= p1Y && y < p1Y + p1H) {
				row[2] = '█';
			}
			if (y >= p2Y && y < p2Y + p2H) {
				row[COLS - 3] = '█';
			}
			if (y === bY && bX >= 0 && bX < COLS) {
				const onLeftPaddle = (bX === 2 && y >= p1Y && y < p1Y + p1H);
				const onRightPaddle = (bX === COLS - 3 && y >= p2Y && y < p2Y + p2H);
				if (!onLeftPaddle && !onRightPaddle) {
					row[bX] = 'o';
				}
			}
			rows.push(row);
		}

		const writeText = (text: string, rowIdx: number, col: number) => {
			if (rows[rowIdx]) {
				for (let i = 0; i < text.length; i++) {
					if (col + i < COLS && col + i >= 0) {
						rows[rowIdx][col + i] = text[i];
					}
				}
			}
		};

		const centerText = (text: string, rowIdx: number) => {
			const col = Math.floor((COLS - text.length) / 2);
			writeText(text, rowIdx, col);
		};

		writeText(`P1: ${wins_left.current}`, 1, 4);
		writeText(`P2: ${wins_right.current}`, 1, COLS - 10);

		if (!keys.current.Space) {
			centerText(translations.current.pressSpace, 13);
			const modeText = gameMode === 'ia' ? translations.current.cpu : gameMode === 'tournament' ? translations.current.tournament : translations.current.vs;
			centerText(modeText, 14);
		}

		screenRef.current.textContent = rows.map(r => r.join('')).join('\n');
	}

	useEffect(() => {
		const loadingTimer = setTimeout(() => {
			setIsLoading(false);
			if (onLoadingChange) onLoadingChange(false);
		}, 1000);

		const dotsInterval = setInterval(() => {
			setLoadingDots(prev => {
				if (prev === ".") return "..";
				if (prev === "..") return "...";
				return ".";
			});
		}, 300);

		return () => {
			clearTimeout(loadingTimer);
			clearInterval(dotsInterval);
		};
	}, []);

	useEffect(() => {
		if (isLoading) return;

		const internalWidth = 600;
		const internalHeight = 400;
		const paddleRightX = internalWidth - 20;

		const keyDown = (e: KeyboardEvent) => {
			if (!ia_playing.current) {
				if (e.key == "ArrowUp") keys.current.ArrowUp = true
				if (e.key == "ArrowDown") keys.current.ArrowDown = true
			}
			if (e.key == "w") keys.current.w = true
			if (e.key == "s") keys.current.s = true
			if (e.key == "W") keys.current.w = true
			if (e.key == "S") keys.current.s = true
		};

		const keyUp = (e: KeyboardEvent) => {
			if (e.key == " ") {
				setOngoingGame(true);
				keys.current.Space = true
			}
			if (!ia_playing.current) {
				if (e.key == "ArrowUp") keys.current.ArrowUp = false
				if (e.key == "ArrowDown") keys.current.ArrowDown = false
			}
			if (e.key == "w") keys.current.w = false
			if (e.key == "s") keys.current.s = false
			if (e.key == "W") keys.current.w = false
			if (e.key == "S") keys.current.s = false
		};

		window.addEventListener("keydown", keyDown);
		window.addEventListener("keyup", keyUp);

		ballSpeedX.current = Random();
		ballSpeedY.current = Random();
		let lastAITick = Date.now();

		const loop = () => {
			const now = Date.now();
			if (now - lastAITick > 1) {
				AIPlaying();
				lastAITick = now;
			}
			if (keys.current.w && (paddleLeftY.current - 25 > 0) && keys.current.Space) {
				paddleLeftY.current -= paddleSpeed;
			}
			if (keys.current.ArrowUp && (paddleRightY.current - 25 > 0) && keys.current.Space) {
				if (ia_playing.current && ticks_count.current < ticks.current) {
					ticks_count.current++
					paddleRightY.current -= paddleSpeed;
				}
				else if (!ia_playing.current)
					paddleRightY.current -= paddleSpeed;
			}
			if (keys.current.s && ((paddleLeftY.current + paddleHeight) + 5 < internalHeight) && keys.current.Space) {
				paddleLeftY.current += paddleSpeed;
			}
			if (keys.current.ArrowDown && ((paddleRightY.current + paddleHeight) + 5) < internalHeight && keys.current.Space) {
				if (ia_playing.current && ticks_count.current < ticks.current) {
					ticks_count.current++
					paddleRightY.current += paddleSpeed;
				}
				else if (!ia_playing.current)
					paddleRightY.current += paddleSpeed;
			}

			if (keys.current.Space) {
				ballX.current += ballSpeedX.current;
				ballY.current += ballSpeedY.current;
			}
			else {
				if (!ia_playing.current) {
					keys.current.ArrowUp = false
					keys.current.ArrowDown = false
				}
				keys.current.w = false
				keys.current.s = false
			}

			if (ballX.current <= (paddleLeftX + paddleWidth + 8) &&
				(ballY.current + ballR) >= paddleLeftY.current &&
				(ballY.current - ballR) <= (paddleLeftY.current + paddleHeight)) {
				ballSpeedX.current *= -1;
				playBeep(300, 'square', 0.08);
			}

			if (ballX.current >= (paddleRightX - paddleWidth - 8) &&
				(ballY.current + ballR) >= paddleRightY.current &&
				(ballY.current - ballR) <= (paddleRightY.current + paddleHeight)) {
				ballSpeedX.current *= -1;
				playBeep(300, 'square', 0.08);
			}

			if (ballY.current < 0 || ballY.current > internalHeight) {
				ballSpeedY.current *= -1;
				playBeep(150, 'square', 0.05);
			}

			if (ballX.current < paddleLeftX + 14 || ballX.current > paddleRightX - 15) {
				if (ballX.current > paddleRightX - 15) {
					wins_left.current++;
					setScoreLeft(wins_left.current);
					playBeep(100, 'sawtooth', 0.3);
				}
				else {
					wins_right.current++;
					setScoreRight(wins_right.current);
					playBeep(100, 'sawtooth', 0.3);
				}

				if (tournament.current && (wins_left.current == 3 || wins_right.current == 3)) {
					if (!players.current.P1 && !players.current.P2) {
						setMatch(`${P3Ref.current} vs ${P4Ref.current}`)
						match_players.current = 0;
					}
					else if (!players.current.P3 && !players.current.P4)
						match_players.current = 1;
					else {
						match_players.current = 2;
						setMatch(`free play`)
					}
				}
				if (tournament.current && is_player.current && (wins_left.current == 3 || wins_right.current == 3) && userRef.current && userRef.current.login == true) {

					if (match_players.current == 0) {
						if (player_pos.current == 1)
							recordMatch(P2Ref.current!, wins_left.current, wins_right.current);
						else if (player_pos.current == 2)
							recordMatch(P1Ref.current!, wins_right.current, wins_left.current);
					}
					else if (match_players.current == 1) {
						if (player_pos.current == 3)
							recordMatch(P4Ref.current!, wins_left.current, wins_right.current);
						else if (player_pos.current == 4)
							recordMatch(P3Ref.current!, wins_right.current, wins_left.current);
					}
					else if (match_players.current == 2) {
						if (tournament_versus.current == "1v3") {
							if (player_pos.current == 1)
								recordMatch(P3Ref.current!, wins_left.current, wins_right.current);
							else if (player_pos.current == 3)
								recordMatch(P1Ref.current!, wins_right.current, wins_left.current);
						}
						else if (tournament_versus.current == "2v3") {
							if (player_pos.current == 2)
								recordMatch(P3Ref.current!, wins_left.current, wins_right.current);
							else if (player_pos.current == 3)
								recordMatch(P2Ref.current!, wins_right.current, wins_left.current);
						}
						else if (tournament_versus.current == "1v4") {
							if (player_pos.current == 1)
								recordMatch(P4Ref.current!, wins_left.current, wins_right.current);
							else if (player_pos.current == 4)
								recordMatch(P1Ref.current!, wins_right.current, wins_left.current);
						}
						else if (tournament_versus.current == "2v4") {
							if (player_pos.current == 2)
								recordMatch(P4Ref.current!, wins_left.current, wins_right.current);
							else if (player_pos.current == 4)
								recordMatch(P2Ref.current!, wins_right.current, wins_left.current);
						}
					}
				}
				if (ballX.current > paddleRightX - 15) {
					if (tournament.current && wins_left.current == 3) {
						if (!players.current.P1 && match_players.current == 0) {
							players.current.P1 = true
							addWinners(`${P1Ref.current}`);
							(`addedWinner = ${P1Ref.current}`)
							if (player_pos.current == 1 && userRef.current && userRef.current.login == true) {
								notify(`${P1Ref.current} ${translations.current.won} +20xp`, 'success');
								tournaments.addVictory();
							}
							else
								notify(`${P1Ref.current} ${translations.current.won}`, 'success');
							if (player_pos.current == 2 && userRef.current && userRef.current.login == true)
								tournaments.addDefeat()
						}
						else if (!players.current.P3 && match_players.current == 1) {
							players.current.P3 = true
							addWinners(`${P3Ref.current}`);
							if (player_pos.current == 3 && userRef.current && userRef.current.login == true) {
								notify(`${P3Ref.current} ${translations.current.won} +20xp`, 'success');
								tournaments.addVictory();
							}
							else
								notify(`${P3Ref.current} ${translations.current.won}`, 'success');
							if (players.current.P1) {
								setMatch(`${P1Ref.current} vs ${P3Ref.current}`)
								tournament_versus.current = "1v3";
							}
							else {
								setMatch(`${P2Ref.current} vs ${P3Ref.current}`)
								tournament_versus.current = "2v3";
							}
							if (player_pos.current == 4 && userRef.current && userRef.current.login == true)
								tournaments.addDefeat()
						}
						else if (players.current.P1 && match_players.current == 2) {
							(`winners.lenght = ${winners.length}`)
							addWinners(`${P1Ref.current}`);
							setOngoingGame(false);
							if (player_pos.current == 1 && userRef.current && userRef.current.login == true) {
								notify(`${P1Ref.current} ${translations.current.wonTournament} +20xp`, 'success');
								tournaments.addVictory();
							}
							else
								notify(`${P1Ref.current} ${translations.current.wonTournament}`, 'success');
							endTournament(userRef.current!, [...winnersRef.current, P1Ref.current!], is_player.current);
							tournament.current = false
							if (tournament_versus.current === "1v3") {
								if (player_pos.current == 3 && userRef.current && userRef.current.login == true)
									tournaments.addDefeat()
							}
							else if (tournament_versus.current === "1v4") {
								if (player_pos.current == 4 && userRef.current && userRef.current.login == true)
									tournaments.addDefeat()
							}
						}
						else if (players.current.P2 && match_players.current == 2) {
							(`winners.lenght = ${winners.length}`)
							addWinners(`${P2Ref.current}`);
							setOngoingGame(false);
							if (player_pos.current == 2 && userRef.current && userRef.current.login == true) {
								notify(`${P2Ref.current} ${translations.current.wonTournament} +20xp`, 'success');
								tournaments.addVictory();
							}
							else
								notify(`${P2Ref.current} ${translations.current.wonTournament}`, 'success');
							endTournament(userRef.current!, [...winnersRef.current, P2Ref.current!], is_player.current);
							tournament.current = false
							if (tournament_versus.current === "2v3") {
								if (player_pos.current == 3 && userRef.current && userRef.current.login == true)
									tournaments.addDefeat()
							}
							else if (tournament_versus.current === "2v4") {
								if (player_pos.current == 4 && userRef.current && userRef.current.login == true)
									tournaments.addDefeat()
							}
						}
						addScore(wins_left.current, wins_right.current);
						wins_left.current = 0;
						wins_right.current = 0;
					}
					else if (ia_playing.current && wins_left.current == 3) {
						setOngoingGame(false);
						if (userRef.current && userRef.current.login == true) {
							recordMatch("IA", wins_left.current, wins_right.current);
							notify(translations.current.victory + " +20xp", 'success');
							tournaments.addVictory()
						}
						else
							notify("VICTORY!", "success")
						wins_left.current = 0;
						wins_right.current = 0;
					}
					else if (wins_left.current == 3) {
						setOngoingGame(false);
						notify(translations.current.wonLeft, 'success');
						wins_left.current = 0;
						wins_right.current = 0;
					}
				}
				else
					if (tournament.current && wins_right.current == 3) {
						if (!players.current.P2 && match_players.current == 0) {
							players.current.P2 = true
							addWinners(`${P2Ref.current}`);
							if (player_pos.current == 2 && userRef.current && userRef.current.login == true) {
								notify(`${P2Ref.current} ${translations.current.won} +20xp`, 'success');
								tournaments.addVictory()
							}
							else
								notify(`${P2Ref.current} ${translations.current.won}`, 'success');
							if (player_pos.current == 1 && userRef.current && userRef.current.login == true) {
								(`add defeat to player !`)
								tournaments.addDefeat()
							}
						}
						else if (!players.current.P4 && match_players.current == 1) {
							players.current.P4 = true
							addWinners(`${P4Ref.current}`);
							if (player_pos.current == 4 && userRef.current && userRef.current.login == true) {
								notify(`${P4Ref.current} ${translations.current.won} +20xp`, 'success');
								tournaments.addVictory()
							}
							else
								notify(`${P4Ref.current} ${translations.current.won}`, 'success');
							if (players.current.P2) {
								setMatch(`${P2Ref.current} vs ${P4Ref.current}`)
								tournament_versus.current = "2v4";
							}
							else {
								setMatch(`${P1Ref.current} vs ${P4Ref.current}`)
								tournament_versus.current = "1v4";
							}
							if (player_pos.current == 3 && userRef.current && userRef.current.login == true)
								tournaments.addDefeat()
						}
						else if (players.current.P3 && match_players.current == 2) {
							(`winners.lenght = ${winners.length}`)
							addWinners(`${P3Ref.current}`);
							setOngoingGame(false);
							if (player_pos.current == 3 && userRef.current && userRef.current.login == true) {
								notify(`${P3Ref.current} ${translations.current.wonTournament} +20xp`, 'success');
								tournaments.addVictory()
							}
							else
								notify(`${P3Ref.current} ${translations.current.wonTournament}`, 'success');
							endTournament(userRef.current!, [...winnersRef.current, P3Ref.current!], is_player.current);
							tournament.current = false
							if (tournament_versus.current === "3v1") {
								if (player_pos.current == 1 && userRef.current && userRef.current.login == true)
									tournaments.addDefeat()
							}
							else if (tournament_versus.current === "3v2") {
								if (player_pos.current == 2 && userRef.current && userRef.current.login == true)
									tournaments.addDefeat()
							}
						}
						else if (players.current.P4 && match_players.current == 2) {
							(`winners.lenght = ${winners.length}`)
							addWinners(`${P4Ref.current}`);
							setOngoingGame(false);
							if (player_pos.current == 4 && userRef.current && userRef.current.login == true) {
								notify(`${P4Ref.current} ${translations.current.wonTournament} +20xp`, 'success');
								tournaments.addVictory()
							}
							else
								notify(`${P4Ref.current} ${translations.current.wonTournament}`, 'success');
							endTournament(userRef.current!, [...winnersRef.current, P4Ref.current!], is_player.current);
							tournament.current = false
							if (tournament_versus.current === "4v1") {
								if (player_pos.current == 1 && userRef.current && userRef.current.login == true)
									tournaments.addDefeat()
							}
							else if (tournament_versus.current === "4v2") {
								if (player_pos.current == 2 && userRef.current && userRef.current.login == true)
									tournaments.addDefeat()
							}
						}
						addScore(wins_left.current, wins_right.current);
						wins_left.current = 0;
						wins_right.current = 0;
					}
					else if (ia_playing.current && wins_right.current == 3) {
						setOngoingGame(false);
						notify(translations.current.defeat, 'error');
						if (userRef.current && userRef.current.login == true)
							tournaments.addDefeat()
						wins_left.current = 0;
						wins_right.current = 0;
					}
					else if (wins_right.current == 3) {
						setOngoingGame(false);
						notify(translations.current.wonRight, 'success');
						wins_left.current = 0;
						wins_right.current = 0;
					}
				if (ia_playing.current) {
					ticks_count.current = 0
					flag.current = 0
					ticks.current = 0
				}
				keys.current.Space = false;
				ballX.current = 300;
				ballY.current = 200;
				paddleLeftY.current = 150;
				paddleRightY.current = 150;
				ballSpeedX.current = Random();
				ballSpeedY.current = Random();
			}

			renderAscii();
			if (ballSpeedX.current > 0 && keys.current.Space)
				ballSpeedX.current += 0.001
			if (ballSpeedX.current < 0 && keys.current.Space)
				ballSpeedX.current -= 0.001
			if (ballSpeedY.current > 0 && keys.current.Space)
				ballSpeedY.current += 0.001
			if (ballSpeedY.current < 0 && keys.current.Space)
				ballSpeedY.current -= 0.001
		}
		const intervalId = setInterval(loop, 10);
		return () => {
			clearInterval(intervalId);
			window.removeEventListener("keydown", keyDown);
			window.removeEventListener("keyup", keyUp);
		};
	}, [isLoading]);

	if (score_left === 3 || score_right === 3) {
		setScoreLeft(0);
		setScoreRight(0);
	}

	const [scale, setScale] = useState(1);

	useEffect(() => {
		const calculateScale = () => {
			const vw = window.innerWidth;
			const baseWidth = 520;
			if (vw < baseWidth) {
				setScale(Math.max(0.5, vw / baseWidth));
			} else {
				setScale(1);
			}
		};

		calculateScale();
		window.addEventListener('resize', calculateScale);
		return () => window.removeEventListener('resize', calculateScale);
	}, []);

	return (
		<div className="flex flex-col items-center w-full overflow-hidden">

			{gameMode === "tournament" && tournamentPlayers.length === 4 && (
				<div className="mb-4 px-4 sm:px-6 py-2 bg-black/80 border border-[#33ff00] rounded font-mono text-center max-w-[90vw]">
					<div className="text-[#33ff00]/60 text-[10px] sm:text-xs uppercase tracking-wider mb-1">{translations.current.currentMatch}</div>
					<div className="text-[#33ff00] text-sm sm:text-lg font-bold tracking-wide animate-text-flicker truncate">{match}</div>
				</div>
			)}

			<div
				className="origin-top transition-transform duration-200"
				style={{ transform: `scale(${scale})` }}
			>
				<Card>
					<div
						ref={screenRef}
						id="game-screen"
						className="whitespace-pre font-mono leading-[14px] sm:leading-[16px] font-bold cursor-default text-[10px] sm:text-[12px] md:text-[14px]"
					>
						{isLoading ? `${translations.current.loading}${loadingDots}` : ""}
					</div>
				</Card>
			</div>
		</div>
	);
}