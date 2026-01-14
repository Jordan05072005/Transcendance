import type { User } from "../types/user.types";

export const checkError = (error: any, user: User| null, setteur: any) =>{	
		if (error == "Unauthorized"){
			setteur({...user, login: false});
		}
	}