import { useUser } from "../hook/useUser";
import type { Friend, User } from "../types/user.types";

function ratio(user: Friend | User)
{
	if (user.nbrDefeat + user.nbrVictory == 0)
		return (0);
	return (((user.nbrVictory * 100) / (user.nbrDefeat + user.nbrVictory)))
}

export default function Leaderboard()
{
	const {user} = useUser();
	if (!user.login)
	{
		return (
			<div className="flex-col w-95/100 h-90/100 p-4 rounded-xl text-shadow-sm text-center bg-white/70">
				<h2 className="text-xl font-bold pb-4">LEADERBOARD</h2>
				<p>Login and you can have a look to your ranking among your friends</p>
			</div>
		);
	}
	if (!user.friends || user.friends.length == 0)
	{
		return (
			<div className="flex-col w-95/100 h-90/100 p-4 rounded-xl text-shadow-sm text-center bg-white/70">
				<h2 className="text-xl font-bold pb-4">LEADERBOARD</h2>
				<p>Add friends to see your rank here</p>
			</div>
		);
	}
	const allFriends: (Friend | User)[] = [];
	for (let i = 0; i < user.friends.length; i++){
		allFriends.push(user.friends[i]);
	}
	allFriends.push(user);
	allFriends.sort(function(a, b){return ratio(b) - ratio(a)})
	let rank: string[] = [];
	for (let i = 0; i < allFriends.length; i++){
		rank[i] = (i + 1) + ". " + allFriends[i].username + " " + ratio(allFriends[i]) + "%";
	}
	return (
		<div className="flex-col w-95/100 h-90/100 rounded-xl text-shadow-sm bg-white/70">
			<h2 className="text-center text-xl font-bold">LEADERBOARD</h2>
			<ul className="overflow-auto">
				{rank.map((line: string) => (
					<li>{line}</li>
				))}
			</ul>
		</div>
	);
}