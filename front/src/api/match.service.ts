import type { MatchHistory } from "../types/user.types";
import { apiMatch, getToken} from "./client";

export const getMatchHistory = async (): Promise<{ matches: MatchHistory[] } | { error: string }> => {
    try {
        const response = await apiMatch.get("", {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        });
        //console.log(`response.data = ${response.data}`);
        return response.data;
    } catch (err: any) {
        if (err.response && err.response.data) {
            return { error: err.response.data.error || "Erreur inconnue" };
        }
        return { error: err.message || "Erreur réseau" };
    }
};

export const createMatch = async (matchData: {
    opponentUsername: string;
    playerScore: number;
    opponentScore: number;
    result: 'win' | 'loss';
    }): Promise<MatchHistory | { error: string }> => {
    //console.log(`opponent username is = ${matchData.opponentUsername}`)
    try {
        const response = await apiMatch.post("/start", matchData, {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
        });
        return response.data;
    } catch (err: any) {
        if (err.response && err.response.data) {
        return { error: err.response.data.error || "Erreur inconnue" };
        }
        return { error: err.message || "Erreur réseau" };
    }
};
