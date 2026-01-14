export default function TournamentResults({mode, tournamentPlayers, winners, score}: any)
{
	if (mode == "tournament" && tournamentPlayers.length === 4)
	{
		switch (winners.length)
		{
			case 0:
				return (
					<div className="flex flex-col items-center justify-center rounded-xl w-95/100 h-90/100 bg-white/70">
						<p className="shadow-sm bg-white/40 rounded-sm px-2">{tournamentPlayers[0]} <span className="font-bold">VS</span> {tournamentPlayers[1]}</p>
						<p>{tournamentPlayers[2]} <span className="font-bold">VS</span> {tournamentPlayers[3]}</p>
						<h2 className="font-bold pt-2">FINAL</h2>
					</div>
				);
			case 1:
				return (
					<div className="flex flex-col items-center justify-center rounded-xl p-4 w-95/100 h-90/100 bg-white/70">
						<p> <span className={`${winners[0] === tournamentPlayers[0] ? "text-green-500" : "text-red-500"}`}>{tournamentPlayers[0]}</span> <span className="font-bold">VS</span> <span className={`${winners[0] === tournamentPlayers[1] ? "text-green-500" : "text-red-500"}`}>{tournamentPlayers[1]}</span> </p>
						<p> <span className={`${score[0] > score[1] ? "text-black font-bold" : "text-black/30 font-bold"}`}>{score[0]}</span> : <span className={`${score[0] < score[1] ? "text-black font-bold" : "text-black/30 font-bold"}`}>{score[1]}</span></p>
						<p className="shadow-sm bg-white/40 rounded-sm px-2">{tournamentPlayers[2]} <span className="font-bold">VS</span> {tournamentPlayers[3]}</p>
						<h2 className="font-bold pt-2">FINAL</h2>
						<p>{winners[0]} <span className="font-bold">VS</span> </p>
					</div>
				);
			case 2:
				return (
					<div className="flex flex-col items-center justify-center rounded-xl p-4 w-95/100 h-90/100 bg-white/70">
						<p> <span className={`${winners[0] === tournamentPlayers[0] ? "text-green-500" : "text-red-500"}`}>{tournamentPlayers[0]}</span> <span className="font-bold">VS</span> <span className={`${winners[0] === tournamentPlayers[1] ? "text-green-500" : "text-red-500"}`}>{tournamentPlayers[1]}</span> </p>
						<p> <span className={`${score[0] > score[1] ? "text-black font-bold" : "text-black/30 font-bold"}`}>{score[0]}</span> : <span className={`${score[0] < score[1] ? "text-black font-bold" : "text-black/30 font-bold"}`}>{score[1]}</span></p>
						<p> <span className={`${winners[1] === tournamentPlayers[2] ? "text-green-500" : "text-red-500"}`}>{tournamentPlayers[2]}</span> <span className="font-bold">VS</span> <span className={`${winners[1] === tournamentPlayers[3] ? "text-green-500" : "text-red-500"}`}>{tournamentPlayers[3]}</span> </p>
						<p> <span className={`${score[2] > score[3] ? "text-black font-bold" : "text-black/30 font-bold"}`}>{score[2]}</span> : <span className={`${score[2] < score[3] ? "text-black font-bold" : "text-black/30 font-bold"}`}>{score[3]}</span></p>
						<h2 className="font-bold pt-2">FINAL</h2>
						<p className="shadow-sm bg-white/40 rounded-sm px-2">{winners[0]} <span className="font-bold">VS</span> {winners[1]}</p>
					</div>
				);
		}
	}
	return (
		<div className="content-center w-95/100 h-90/100 rounded-xl bg-white/70">
			<p className="text-center">Start a tournament to see the tournament's dashboard here</p>
		</div>
	);
}