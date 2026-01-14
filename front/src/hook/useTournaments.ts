import type { UseTournamentsReturn } from "../types/user.types";
import { useAuth } from "./useAuth";
import { useUser } from "./useUser";

export const useTournaments = () : UseTournamentsReturn =>{

	const {user} = useUser();
	const auth = useAuth();

	const addVictory = () =>{
		(`addVictory() = ${user.nbrVictory}`);
		auth.sendVictory({nbrVictory: user.nbrVictory})
	}

	const addDefeat = () =>{
		(`addDefeat() = ${user.nbrDefeat}`);
		auth.sendLoss({nbrDefeat: user.nbrDefeat})
	}

	return {
		addVictory,
		addDefeat
	}
}