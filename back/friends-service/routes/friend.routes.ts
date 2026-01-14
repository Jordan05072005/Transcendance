import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import type { JwtPayload } from '../types/fastify.js';
import https from 'https';
import axios from 'axios';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { DataRequest } from '../entity/user.entity.js';
import { FriendsService } from '../services/friends.services.js';
import { RequestBodyDTO } from '../dto/user.dto.js';



export function FriendsRoutes(fastify: FastifyInstance) {
	const friendsService = new FriendsService();

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

	fastify.post('/request', { preValidation: [fastify.authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
		const senderUsername = plainToInstance(RequestBodyDTO, request.body);
		const error = await validate(senderUsername, { whitelist: true, forbidNonWhitelisted: true });
		if (error.length > 0)
			return reply.status(400).send({ error: error[0]?.property + " is bad." });
		const id: number = (request.currentUser as JwtPayload)?.id;
		try {
			const response = await friendsService.addRequest(id, senderUsername.username, request.headers.authorization || "");
			fastify.log.info({ ip: request.ip, dataUser: id, datasender: senderUsername }, `Post Request success`);
			return (response);
		}
		catch (err: unknown) {
			fastify.log.info({
				ip: request.ip, dataUser: id, datasender: senderUsername,
				reason: err instanceof Error ? err.message : 'Unknown error'
			}, 'Post Request failed');
			if (err instanceof Error)
				if (err instanceof Error)
					return reply.status(404).send({ error: err.message });
			return reply.status(500).send({ error: 'Unknown error.' });
		}
	});


	fastify.get('/request', { preValidation: [fastify.authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
		const id: number = (request.currentUser as JwtPayload)?.id;
		try {
			const response = await friendsService.getRequest(id, request.headers.authorization || "");
			fastify.log.info({ ip: request.ip, dataUser: id }, `Get Request success`);
			return (response);
		}
		catch (err: unknown) {
			fastify.log.info({
				ip: request.ip, dataUser: id,
				reason: err instanceof Error ? err.message : 'Unknown error'
			}, 'Get Request failed');
			if (err instanceof Error)
				return reply.status(404).send({ error: err.message });
			return reply.status(500).send({ error: 'Unknown error.' });
		}
	});

	fastify.get('/friends', { preValidation: [fastify.authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
		const id: number = (request.currentUser as JwtPayload)?.id;
		try {
			const response = await friendsService.getFriend(id, request.headers.authorization || "");
			fastify.log.info({ ip: request.ip, dataUser: id }, `Get Friends success`);
			return (response);
		}
		catch (err: unknown) {
			fastify.log.info({
				ip: request.ip, dataUser: id,
				reason: err instanceof Error ? err.message : 'Unknown error'
			}, 'Get Friends failed');
			if (err instanceof Error)
				return reply.status(404).send({ error: err.message });
			return reply.status(500).send({ error: 'Unknown error.' });
		}
	});

	fastify.post('/friends', { preValidation: [fastify.authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
		const username = plainToInstance(RequestBodyDTO, request.body);
		const error = await validate(username, { whitelist: true, forbidNonWhitelisted: true });
		if (error.length > 0)
			return reply.status(400).send({ error: error[0]?.property + " is bad." });
		const id: number = (request.currentUser as JwtPayload)?.id;
		try {
			await friendsService.saveFriend(id, username.username, request.headers.authorization || "");
			fastify.log.info({ ip: request.ip, dataUser: id, data: username }, `Post Friends success`);
			return ({ state: "success" });
		}
		catch (err: unknown) {
			fastify.log.info({
				ip: request.ip, dataUser: id, data: username,
				reason: err instanceof Error ? err.message : 'Unknown error'
			}, 'Post Friends failed');
			if (err instanceof Error)
				return reply.status(404).send({ error: err.message });
			return reply.status(500).send({ error: 'Unknown error.' });
		}
	});

	fastify.delete('/request/reject/:username', { preValidation: [fastify.authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
		const username = request.params as { username: string };
		const id: number = (request.currentUser as JwtPayload)?.id;
		try {
			await friendsService.delRequest(id, username.username, request.headers.authorization || "");
			fastify.log.info({ ip: request.ip, dataUser: id, data: username }, `Delete Friends success`);
			return { state: "success" };
		}
		catch (err: unknown) {
			fastify.log.info({
				ip: request.ip, dataUser: id, data: username,
				reason: err instanceof Error ? err.message : 'Unknown error'
			}, 'Delete Friends failed');
			if (err instanceof Error)
				return reply.status(404).send({ error: err.message });
			return reply.status(500).send({ error: 'Unknown error.' });
		}
	});

	fastify.delete('/:username', { preValidation: [fastify.authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
		const username = request.params as { username: string };
		const id: number = (request.currentUser as JwtPayload)?.id;
		try {
			await friendsService.deleteFriend(id, username.username, request.headers.authorization || "");
			fastify.log.info({ ip: request.ip, dataUser: id, data: username }, `Delete Friend success`);
			return { state: "success" };
		}
		catch (err: unknown) {
			fastify.log.info({
				ip: request.ip, dataUser: id, data: username,
				reason: err instanceof Error ? err.message : 'Unknown error'
			}, 'Delete Friend failed');
			if (err instanceof Error)
				return reply.status(404).send({ error: err.message });
			return reply.status(500).send({ error: 'Unknown error.' });
		}
	});

		fastify.delete('/player', { preValidation: [fastify.authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
		const id: number = (request.currentUser as JwtPayload)?.id;
		try {
			await friendsService.deleteplayer(id);
			fastify.log.info({ ip: request.ip, dataUser: id}, `Delete Friend success`);
			return { state: "success" };
		}
		catch (err: unknown) {
			fastify.log.info({
				ip: request.ip, dataUser: id,
				reason: err instanceof Error ? err.message : 'Unknown error'
			}, 'Delete Friend failed');
			if (err instanceof Error)
				return reply.status(404).send({ error: err.message });
			return reply.status(500).send({ error: 'Unknown error.' });
		}
	});

}
