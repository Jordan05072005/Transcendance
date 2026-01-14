export type GameMode = "ia" | "duel" | "tournament";

interface setMode {
	changeSelectedMode: (mode: GameMode | "tournamentForm") => void;
	mode: GameMode | "tournamentForm";
	game: boolean;
}

export default function GameModeButtons({changeSelectedMode, mode, game}: setMode)
{
	let isTournamentActive = false;
	if (mode === "tournament")
		isTournamentActive = true;
	
	return (
		<div className="flex gap-4 justify-center py-4">
			<button 
				onClick={() => !isTournamentActive && !game && changeSelectedMode("ia")} 
				className={`rounded-lg text-black ${mode === "ia" ? "!bg-black/30" : "!bg-white"}`}>
				IA
			</button>

			<button 
				onClick={() => !isTournamentActive && !game && changeSelectedMode("duel")} 
				className={`rounded-lg text-black ${mode === "duel" ? "!bg-black/30" : "!bg-white"}`}>
				DUEL
			</button>

			<button 
				onClick={() => !isTournamentActive && !game && changeSelectedMode("tournamentForm")} 
				className={`rounded-lg text-black ${mode === "tournament" ? "!bg-black/30" : "!bg-white"}`}>
				TOURNAMENT
			</button>
		</div>
	)
}