export interface UserLogin {
	email: string
	password: string
};

export interface UserSignUp extends UserLogin {
	username: string;
	isTwoFactorEnabled?: boolean;
}

export interface User extends UserSignUp {
	avatar?: File | null;
	avatarPath?: string;
	nbrVictory: number;
	nbrDefeat: number;
	achivementVictory: boolean;
	achivementLoss: boolean;
	achivementDestroyer: boolean;
	login: boolean;
	friends: Friend[];
	id: number;
	lang: string;
}

export interface Friend {
	username: string,
	nbrVictory: number;
	nbrDefeat: number;
	login: boolean;
}

export type UpdateUser = Partial<User>;


export interface ResponseLogin {
	token: string;
	user: User;
};

export interface UseAuthReturn {
	profilPage: boolean;
	SetProfilPage: (value: boolean) => void;
	signupForm: UserSignUp;
	SetSignUpForm: (form: UserSignUp) => void;
	fetchDataUser: () => Promise<void>
	sendLogin: () => Promise<boolean>;
	sendSignUp: () => Promise<boolean>;
	sendUpdate: (updateUser: UpdateUser) => Promise<void>;
	deleteUser: (id: number) => Promise<void>;
	sendVictory: (updateUser: UpdateUser) => Promise<void>;
	sendLoss: (updateUser: UpdateUser) => Promise<void>;
	sendCode: (code: string) => Promise<void>;
	DoubleAuthPage: boolean,
	setDoubleAuthPage: (state: boolean) => void;
	logout: (val: boolean) => void;
}

export interface UseMatchReturn {
	matches: MatchHistory[];
	loading: boolean,
	error: string,
	recordMatch: () => Promise<boolean>
	refetch: () => Promise<void>
}

export interface UseFriendReturn {
	friendsPage: boolean;
	openFriendPage: (value: boolean) => void;
	sendRequest: (username: string) => Promise<void>;
	getRequest: () => Promise<void>;
	getFriend: () => Promise<void>;
	listRequest: string[],
	saveRequest: (username: string) => Promise<void>;
	delRequest: (username: string) => Promise<void>;
	deleteFriend: (username: string) => Promise<void>;
}

export interface UseTournamentsReturn {
	addVictory: () => void;
	addDefeat: () => void;
}

export interface UseAchivementReturn {
	addAchivementVictory: () => void;
	addAchivementLoss: () => void;
	addAchivementDestroy: () => void;
}

export interface Form<T> {
	data: T;
	txt: string,
	title: string
}

export interface ListRequestFriend {
	users: string[]
}

export interface ListFriend {
	friends: Friend[]
}

export interface MatchHistory {
	id: number;
	opponentUsername: string;
	playerScore: number;
	opponentScore: number;
	result: 'win' | 'loss';
	playedAt: string;
}