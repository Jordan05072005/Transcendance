import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { MatchService } from '../services/match.service.js';
import axios from 'axios';
import https from 'https';

export function matchRoutes(fastify: FastifyInstance) {
	const matchService = new MatchService();

	fastify.decorateRequest('currentUser', {
		getter() {
			return this._currentUser;
		},
		setter(value: any) {
			this._currentUser = value;
		}
	});

	fastify.decorate(
		'authenticate',
		async (request: any, reply: any) => {
			try {
				const authHeader = request.headers.authorization;
				if (!authHeader) {
					return reply.status(401).send({ error: "No token provided" });
				}
				const token = authHeader.replace("Bearer ", "");
				const agent = new https.Agent({
					rejectUnauthorized: false,
				});
				const response = await axios.get(`https://auth-service:3001/verify`, {
					headers: { Authorization: `Bearer ${token}` },
					httpsAgent: agent
				});
				request.currentUser = { id: response.data.id };
			} catch (err) {
				reply.send(err);
			}
		}
	);

	fastify.get('/matches', { preValidation: [fastify.authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
		const userId: number = (request as any).currentUser?.id;
		if (!userId)
			return reply.status(401).send({ error: 'Unauthorized' });
		try {
			const history = await matchService.getMatchHistory(userId);
			fastify.log.info({ip: request.ip, id: userId}, `Get Matches success`);
			return { matches: history };
		} catch (err: unknown) {
			fastify.log.info({ ip: request.ip, id: userId,
			reason: err instanceof Error ? err.message : 'Unknown error' },'Get Matches failed');
			return reply.status(500).send({ error: 'Failed to retrieve match history.' });
		}
	});

	fastify.post('/matches/start', { preValidation: [fastify.authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
		const player1Id: number = (request as any).currentUser?.id;
		if (!player1Id) {
			return reply.status(401).send({ error: 'Unauthorized' });
		}
		const { opponentUsername, playerScore, opponentScore, result } = request.body as {
			opponentUsername: string;
			playerScore: number;
			opponentScore: number;
			result: 'win' | 'loss';
		};
		try {
			const newMatch = await matchService.startNewMatch({
				player1Id,
				opponentUsername,
				playerScore,
				opponentScore,
				result,
				authHeader: request.headers.authorization || '',
			});
			fastify.log.info({ip: request.ip, id: player1Id}, `Post Matches success`);
			return reply.status(201).send(newMatch);
		} catch (err: unknown) {
			fastify.log.info({ ip: request.ip, id: player1Id,
			reason: err instanceof Error ? err.message : 'Unknown error' },'Post Matches failed');
			return reply.status(404).send({ error: 'Failed to start new match.' });
		}
	});
}