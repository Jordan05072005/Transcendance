import React, {createContext, useContext, useState} from "react";
import { useAuth } from "./useAuth";
import type { User } from "../types/user.types";

type UserContextType = {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
};

const UserContext = createContext<UserContextType>(  
	{user: {id: 0, username: "", email: "", password: "",
    isTwoFactorEnabled: false, nbrVictory: 0, nbrDefeat: 0,
    login : false, achivementVictory: false, achivementLoss: false,
    achivementDestroyer: false, friends:[], avatar: null, lang: "en"} ,
  setUser: () => {},});

export function UserProvider({ children } : any) {
  const [user, setUser] = useState<User>({
    username: "",
    email: "",
    password: "",
    isTwoFactorEnabled: false,
	nbrDefeat: 0,
	nbrVictory: 0,
    achivementVictory: false,
    achivementLoss: false,
    achivementDestroyer: false,
	login: false,
	friends:[],
	avatar: null,
    id: 0,
	lang: "en"
  });
  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
}

export function useUser() {
  return useContext(UserContext);
}

export const useAchivements = () => {
	const auth = useAuth();

	const addAchivementVictory = () =>{
		//console.log(`achivementVictory = ${user.achivementVictory}`);
		auth.sendUpdate({achivementVictory: true})
  }

	const addAchivementLoss = () =>{
		//console.log(`achivementLoss = ${user.achivementLoss}`);
		auth.sendUpdate({achivementLoss: true})
	}

  const addAchivementDestroy = () =>{
		//console.log(`achivementDestroyer = ${user.achivementDestroyer}`);
		auth.sendUpdate({achivementDestroyer: true})
	}

	return{
		addAchivementVictory,
    	addAchivementLoss,
		addAchivementDestroy
	}
}