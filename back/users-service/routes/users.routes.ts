import { plainToInstance } from 'class-transformer';
import axios from 'axios';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { UsersService } from '../services/users.service.js';
import type { FastifyRequestFile, JwtPayload, MulterFile } from '../types/fastify.js';
import https from 'https';
import { validate } from 'class-validator';
import { DataUserDTO, UpdateAvatarDTO, UpdateDataUserDTO } from '../dto/user.dto.js';




export function UsersRoutes(fastify: FastifyInstance) {
	const	usersService = new UsersService();

	fastify.decorateRequest('currentUser', {
		getter() {
			return this._currentUser;
		},
		setter(value) {
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
				const token = authHeader.replace("Bearer ", "").trim();
				console.log(token);
				const agent = new https.Agent({
					rejectUnauthorized: false,
				});
				const response = await axios.get(`https://auth-service:3001/verify`, {
					headers: { Authorization: `Bearer ${token}` },
					httpsAgent: agent
				});
				request.currentUser = { id: response.data.id };
			} catch (err) {
				console.log(err);
				reply.send(err);
			}
		}
	);

	fastify.get('/users', { preValidation: [fastify.authenticate] }, async (request, reply) => {
		const id: number = (request.currentUser as JwtPayload)?.id;
		try{
			const response = await usersService.getUser(id);
			fastify.log.info({ip: request.ip, dataUser: id}, `Get User success`);
			return response;
		}catch(err: unknown){
		fastify.log.info({ ip: request.ip, dataUser: id,
			reason: err instanceof Error ? err.message : 'Unknown error' },'Get User failed');
		if (err instanceof Error)
				return reply.status(404).send({ error: err.message });
			return reply.status(500).send({ error: 'Unknown error.' });
		}
	});

	fastify.get('/users/by-username/:username', { preValidation: [fastify.authenticate] }, async (request, reply) => {
		const {username} = request.params as {username :string};
		try{
			const response = await usersService.getUserByUsername(username);
			fastify.log.info({ip: request.ip, dataUser: username}, `Get by username User success`);
			return response;
		}catch(err: unknown){
			fastify.log.info({ ip: request.ip, dataUser: username,
			reason: err instanceof Error ? err.message : 'Unknown error' },'Get by username User failed');
			if (err instanceof Error)
				return reply.status(404).send({ error: err.message });
			return reply.status(500).send({ error: 'Unknown error.' });
		}
	});

	fastify.get('/users/by-id/:id', { preValidation: [fastify.authenticate] }, async (request, reply) => {
		const {id} = request.params as {id :number};
		try{
			const response = await usersService.getUserById(id);
			fastify.log.info({ip: request.ip, dataUser: id}, `Get by ID User success`);
			return response;
		}catch(err: unknown){
			fastify.log.info({ ip: request.ip, dataUser: id,
				reason: err instanceof Error ? err.message : 'Unknown error' },'Get by ID User failed');
			if (err instanceof Error)
				return reply.status(404).send({ error: err.message });
			return reply.status(500).send({ error: 'Unknown error.' });
		}
	});

	fastify.delete('/users/deletion/:id', { preValidation: [fastify.authenticate] }, async (request, reply) => {
		const {id} = request.params as {id :number};
		const idtoken: number = (request.currentUser as JwtPayload)?.id;
		if (id != idtoken){
			fastify.log.info({ip: request.ip, dataUser: id}, `Delete User failed, 403`);
			return reply.status(403).send({ error: "Unauthorized delete this accompte" });
		}
		try{
			const response = await usersService.deleteUserById(id, request.headers.authorization||"");
			fastify.log.info({ip: request.ip, dataUser: id}, `Delete User success`);
			return response;
		}catch(err: unknown){
			fastify.log.info({ ip: request.ip, dataUser: id,
				reason: err instanceof Error ? err.message : 'Unknown error' },'Delete User failed');
			if (err instanceof Error)
				return reply.status(404).send({ error: err.message });
			return reply.status(500).send({ error: 'Unknown error.' });
		}
	});

	fastify.post('/users',  async (request, reply) => {
		const datauser = plainToInstance(DataUserDTO, request.body);
  	const error = await validate(datauser, { whitelist: true, forbidNonWhitelisted: true });
		if (error.length > 0)
			return reply.status(400).send({ error : error[0]?.property + " is bad."});
		try{
			await usersService.setDataUser(datauser);
			fastify.log.info({ip: request.ip, dataUser: datauser}, `Create User success`);
			return {state: "good"}
		}catch(err: unknown){
			fastify.log.info({ ip: request.ip, dataUser: datauser,
				reason: err instanceof Error ? err.message : 'Unknown error' },'Create User failed');
			if (err instanceof Error)
				return reply.status(404).send({ error: err.message });
			return reply.status(500).send({ error: 'Unknown error.' });
		}
	});



	fastify.patch('/users', { preValidation: [fastify.authenticate] }, async (request: FastifyRequest<{Body: UpdateDataUserDTO}>, reply) => {
		const user = plainToInstance(UpdateDataUserDTO, request.body);
  	const error = await validate(user, { whitelist: true, forbidNonWhitelisted: true });
		if (error.length > 0)
			return reply.status(400).send({ error : error[0]?.property + " is bad."});
		const id: number = (request.currentUser as JwtPayload)?.id;
		try{
			const response = await usersService.patchUser(user, id, request.headers.authorization||"");
			fastify.log.info({ip: request.ip, dataUser: user, id: id}, `Patch User success`);
			return response;
		}catch(err: unknown){
			fastify.log.info({ ip: request.ip, dataUser: user, id: id,
				reason: err instanceof Error ? err.message : 'Unknown error' },'Patch User failed');
			if (err instanceof Error)
				return reply.status(404).send({ error: err.message });
			return reply.status(500).send({ error: 'Unknown error.' });
		}
	});

	fastify.patch('/users/victory', { preValidation: [fastify.authenticate] }, async (request: FastifyRequest<{Body: UpdateDataUserDTO}>, reply) => {
		const user = plainToInstance(UpdateDataUserDTO, request.body);
  		const error = await validate(user, { whitelist: true, forbidNonWhitelisted: true });
		if (error.length > 0)
			return reply.status(400).send({ error : error[0]?.property + " is bad."});
		const id: number = (request.currentUser as JwtPayload)?.id;
		try{
			const response = await usersService.patchUserVictory(user, id, request.headers.authorization||"");
			return response;
		}catch(err: unknown){
			if (err instanceof Error)
				return reply.status(404).send({ error: err.message });
			return reply.status(500).send({ error: 'Unknown error.' });
		}
	});

	fastify.patch('/users/loss', { preValidation: [fastify.authenticate] }, async (request: FastifyRequest<{Body: UpdateDataUserDTO}>, reply) => {
		const user = plainToInstance(UpdateDataUserDTO, request.body);
  		const error = await validate(user, { whitelist: true, forbidNonWhitelisted: true });
		if (error.length > 0)
			return reply.status(400).send({ error : error[0]?.property + " is bad."});
		const id: number = (request.currentUser as JwtPayload)?.id;
		try{
			const response = await usersService.patchUserLoss(user, id, request.headers.authorization||"");
			return response;
		}catch(err: unknown){
			if (err instanceof Error)
				return reply.status(404).send({ error: err.message });
			return reply.status(500).send({ error: 'Unknown error.' });
		}
	});

	fastify.patch('/users/avatar', 
			{ preValidation: [fastify.authenticate] }, 
			async (request, reply) => {
				const id: number = (request.currentUser as JwtPayload)?.id;
				try {
						const data = await request.file();
						if (!data) {
								return reply.status(400).send({ error: "No file uploaded" });
						}
						if (!data.mimetype.startsWith('image/')) {
								return reply.status(400).send({ error: "File must be an image" });
						}
						const buffer = await data.toBuffer();
						const fileData : MulterFile = {
								buffer: buffer,
								originalname: data.filename,
								mimetype: data.mimetype,
								size: buffer.length
						};
						const response = await usersService.updateAvatar(id, fileData);
						fastify.log.info({ip: request.ip, id: id, filedata: fileData}, `Patch Avatar success`);
						return response;
				} catch (err: unknown) {
					fastify.log.info({ ip: request.ip, id: id ,
						reason: err instanceof Error ? err.message : 'Unknown error' },'Patch Avatar failed');
					if (err instanceof Error)
								return reply.status(500).send({ error: err.message });
						return reply.status(500).send({ error: 'Unknown error.' });
				}
		}
	);

		fastify.get('/avatars/:filename', async (request: FastifyRequest, reply: FastifyReply) => {
		const { filename } = request.params as { filename: string };

		try {
			const { buffer, mimeType, stats } = await usersService.getAvatarFile(filename);

			const etag = `"${stats.mtime.getTime()}-${stats.size}"`;
			const clientEtag = request.headers['if-none-match'];

			if (clientEtag === etag) {
				return reply
					.code(304)
					.send();
			}
			fastify.log.info({ip: request.ip, filename: filename}, `Get Avatar success`);
			return reply
				.code(200)
				.type(mimeType)
				.header('Cache-Control', 'public, max-age=31536000, immutable') // Cache 1 an
				.header('ETag', etag)
				.header('Last-Modified', stats.mtime.toUTCString())
				.header('Content-Length', stats.size)
				.send(buffer);
		} catch (err: unknown) {
			fastify.log.info({ ip: request.ip, filename: filename ,
				reason: err instanceof Error ? err.message : 'Unknown error' },'Get Avatar failed');
			if (err instanceof Error) {
				if (err.message === 'Avatar not found' || err.message === 'Invalid filename') {
					return reply.status(404).send({error: 'Avatar not found',statusCode: 404});
				}
			}
			return reply.status(500).send({ error: 'Internal server error',statusCode: 500});
		}
	});
	}
