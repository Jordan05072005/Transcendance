import { LoginDTO, UpdateUserDTO, SignUpDTO } from '../dto/auth.dto.js';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { AuthService } from '../services/auth.service.js';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import type { JwtPayload } from '../types/fastify.js';
import type { RedisClientType } from 'redis';


export function authRoutes(fastify: FastifyInstance, redisClient: RedisClientType<Record<string, never>>) {
	const authService = new AuthService();


	interface JwtPayload2 {
		id: number;
		email: string;
		jti: string;
		iat?: number;
		exp?: number;
	}

	fastify.decorate(
		'authenticate',
		async (request: any, reply: any) => {
			try {
				const decoded = await request.jwtVerify() as JwtPayload2;

				const userId = decoded.id;
				const jti = decoded.jti;

				const activeJti = await redisClient.get(`activeSession:${userId}`);
				if (!activeJti || activeJti !== jti) {
					fastify.log.info({ ip: request.ip }, `Token expired`);
					return reply.status(401).send({ error: "Token expired (logged in elsewhere)" });
				}

				request.user = decoded;
				fastify.log.info({ ip: request.ip, }, `Check Token success`);
			} catch (err) {
				console.log(err);
				fastify.log.info({ ip: request.ip }, `Check Token failed`);
				return reply.status(401).send({ error: "Invalid token" });
			}
		}
	);

	fastify.get('/ready', async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			fastify.log.info('Server Auth Started');
			return reply.status(200).send({ status: 'ok' });
		} catch (err) {
			fastify.log.info('DB Not Ready');
			reply.status(503).send({ status: 'error', message: 'DB not ready' });
		}
	});

	fastify.post('/login', async (request: FastifyRequest, reply: FastifyReply) => {
		const login = plainToInstance(LoginDTO, request.body);
		const error = await validate(login, { whitelist: true, forbidNonWhitelisted: true });
		if (error.length > 0)
			return reply.status(400).send({ error: error[0]?.property + " is bad." });
		try {
			const response = await authService.login(login, fastify, redisClient);
			fastify.log.info({ ip: request.ip, email: login.email }, `Login success`);
			console.log(response);
			return (response);
		}
		catch (err: unknown) {
			if (err instanceof Error) {
				fastify.log.info({ ip: request.ip, dataUser: login, reason: err.message }, `Login failed`);
				return reply.status(404).send({ error: err.message });
			}
			fastify.log.info({ ip: request.ip, dataUser: login }, `Login failed`);
			return reply.status(500).send({ error: 'Unknown error.' });
		}
	});

	fastify.post('/login/twoFactor', async (request: FastifyRequest, reply: FastifyReply) => {
		const { email, password, code } = request.body as {
			email: string;
			password: string;
			code: string;
		};
		const login: LoginDTO = { email, password };
		const twoFactorCode: string = code;
		try {
			const response = await authService.checkCode(login, twoFactorCode, fastify, redisClient);
			fastify.log.info({ ip: request.ip, dataUser: login }, `TwoFactor success`);
			return (response);
		}
		catch (err: unknown) {
			if (err instanceof Error) {
				fastify.log.info({ ip: request.ip, dataUser: login, reason: err.message }, `TwoFactor failed`);
				return reply.status(404).send({ error: err.message });
			}
			fastify.log.info({ ip: request.ip, dataUser: login }, `TwoFactor failed`);
			return reply.status(500).send({ error: 'Unknown error.' });
		}
	});

	fastify.post('/signup', async (request: FastifyRequest, reply: FastifyReply) => {
		const signup = plainToInstance(SignUpDTO, request.body);
		const error = await validate(signup, { whitelist: true, forbidNonWhitelisted: true });
		if (error.length > 0)
			return reply.status(400).send({ error: error[0]?.property + " is bad." });
		try {
			await authService.signup(signup);
			fastify.log.info({ ip: request.ip, dataUser: signup }, `Signup success`);
			return ({});
		}
		catch (err: unknown) {
			if (err instanceof Error) {
				fastify.log.info({ ip: request.ip, dataUser: signup, reason: err.message }, `SignUp failed`);
				return reply.status(404).send({ error: err.message });
			}
			fastify.log.info({ ip: request.ip, dataUser: signup }, `SignUp failed`);
			return reply.status(500).send({ error: 'Unknown error.' });
		}
	});

	fastify.patch('/patch', { preValidation: [fastify.authenticate] }, async (request: FastifyRequest<{ Body: UpdateUserDTO }>, reply) => {
		const user = plainToInstance(UpdateUserDTO, request.body);
		const error = await validate(user, { whitelist: true, forbidNonWhitelisted: true });
		if (error.length > 0)
			return reply.status(400).send({ error: error[0]?.property + " is bad." });
		const id: number = (request.user as JwtPayload)?.id;
		try {
			await authService.patchUser(user, id);
			fastify.log.info({ ip: request.ip, dataUser: user }, `Patch User success`);
			return;
		} catch (err: unknown) {
			if (err instanceof Error) {
				fastify.log.info({ ip: request.ip, dataUser: user, reason: err.message }, `Patch User failed`);
				return reply.status(404).send({ error: err.message });
			}
			fastify.log.info({ ip: request.ip, dataUser: user }, `Patch User failed`);
			return reply.status(500).send({ error: 'Unknown error.' });
		}
	});

	fastify.delete('/delete/:id', { preValidation: [fastify.authenticate] }, async (request: FastifyRequest<{ Body: UpdateUserDTO }>, reply) => {
		const param = request.params as { id: number };
		try {
			await authService.deleteUser(param.id);
			fastify.log.info({ ip: request.ip, dataUser: param }, `Delete User success`);
			return;
		} catch (err: unknown) {
			if (err instanceof Error) {
				fastify.log.info({ ip: request.ip, dataUser: param, reason: err.message }, `Delete User failed`);
				return reply.status(404).send({ error: err.message });
			}
			fastify.log.info({ ip: request.ip, dataUser: param }, `Delete User failed`);
			return reply.status(500).send({ error: 'Unknown error.' });
		}
	});

	fastify.get('/verify', { preValidation: [fastify.authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
		const id: number = (request.user as JwtPayload)?.id;
		return { id: id };
	});

	fastify.get('/state/:userid', { preValidation: [fastify.authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
		const userid = request.params as { userid: number };
		try {
			const response = await authService.checkState(userid.userid);
			fastify.log.info({ ip: request.ip, dataUser: userid }, `Get State success`);
			return response;
		}
		catch (err: unknown) {
			if (err instanceof Error) {
				fastify.log.info({ ip: request.ip, dataUser: userid, reason: err.message }, `Get State failed`);
				return reply.status(404).send({ error: err.message });
			}
			fastify.log.info({ ip: request.ip, dataUser: userid }, `Get State failed`);
			return reply.status(500).send({ error: 'Unknown error.' });
		}
	});
}

