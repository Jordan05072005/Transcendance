import { AppDataSource } from '../data-source.js';
import { Match } from '../entity/match.entity.js';
import axios from 'axios';
import https from 'https';
import type { DeepPartial } from 'typeorm';

interface StartMatchInput {
    player1Id: number;
    opponentUsername: string;
    playerScore: number;
    opponentScore: number;
    result: 'win' | 'loss';
    authHeader: string;
}

export class MatchService {
async startNewMatch(data: StartMatchInput) {
        try {
            const matchRepository = AppDataSource.getRepository(Match);

            const agent = new https.Agent({
                rejectUnauthorized: false,
            });
            const usersServiceUrl = `https://users-service:3001/users/by-id/${data.player1Id}`;

            let player1Username: string;
            try {
                const response = await axios.get(usersServiceUrl, {
                    headers: { Authorization: data.authHeader },
                    httpsAgent: agent,
                });
                player1Username = response.data.username;
                if (!player1Username) {
                    throw new Error('response.missingUsername');
                }
            } catch (e: any) {
                console.error("Can't get users-service", e?.message);
                throw new Error("response.playerNotFound");
            }

            const player2Id = 0;
            const winnerId: number = data.result === 'win' ? data.player1Id : player2Id;

            const newMatchData: DeepPartial<Match> = {
                player1: player1Username,
                player1Id: data.player1Id,
                player2: data.opponentUsername,
                player2Id: player2Id,
                scorePlayer1: data.playerScore,
                scorePlayer2: data.opponentScore,
                startTime: new Date(),
                winnerId,
            };
            const newMatch = matchRepository.create(newMatchData as any);

            return await matchRepository.save(newMatch);
        } catch (error: any) {
            console.error("MatchService:", error.message);
            throw error;
        }
    }

    async getMatchHistory(userId: number): Promise<any[]> {
        const matchRepository = AppDataSource.getRepository(Match);
        const matches = await matchRepository.find({
            where: [
                { player1Id: userId },
            ],
            order: { startTime: 'DESC' }
        });

        return matches.map(match => ({
            id: match.id,
            opponentUsername: match.player2,
            playerScore: match.player1Id === userId ? match.scorePlayer1 : match.scorePlayer2,
            opponentScore: match.player1Id === userId ? match.scorePlayer2 : match.scorePlayer1,
            result: match.winnerId === userId ? 'win' : 'loss',
            playedAt: match.startTime,
        }));
    }
}