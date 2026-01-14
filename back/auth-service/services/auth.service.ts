import { AppDataSource } from "../data-source.js";
import { User } from "../entity/user.entity.js";
import type { FastifyInstance } from 'fastify';
import { validate } from 'class-validator';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import { LoginDTO, SignUpDTO, UpdateUserDTO, type UserDTO } from '../dto/auth.dto.js';
import https from 'https';
import axios from 'axios';
import type { RedisClientType } from 'redis';
import { v4 as uuidv4 } from 'uuid';



const transporter = nodemailer.createTransport({
	host: process.env.SMTP_HOST,
	port: Number(process.env.SMTP_PORT),
	secure: false,
	auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASS,
	},
});


export class AuthService {

	returnUser(user: UserDTO) {
		const { id, twoFactorExpires, twoFactorCode, ...returnuser } = user;
		return returnuser;
	}

	getagent() {
		const agent = new https.Agent({
			rejectUnauthorized: false,
		});
		return agent;
	}

	async signup(user: SignUpDTO) {

		await AppDataSource.transaction(async (manager: any) => {
			const newUser = new User();
			newUser.email = user.email;
			newUser.isTwoFactorEnabled = user.isTwoFactorEnabled;
			newUser.password = await bcrypt.hash(user.password, 10);
			newUser.login = false;
			try {
				const userid = await manager.save(newUser);
				const response = await axios.post(`https://users-service:3001/users`,
					{ username: user.username, email: user.email, idauth: userid.id, isTwoFactorEnabled: userid.isTwoFactorEnabled }, {
					httpsAgent: this.getagent()
				});
				console.log(response);
			} catch (error: any) {
				console.log(error);
				if (error.code === "SQLITE_CONSTRAINT") {
					if (error.message.includes("username")) {
						throw new Error("response.existUsername");
					}
					if (error.message.includes("email")) {
						throw new Error("response.existEmail");
					}
					throw new Error("response.unique");
				}
				if (error && (error as any).status === 404) {
					throw new Error(error.response.data.error);
				}
				throw error;
			}
		})
	}

	async sendCode(user: User) {
		const code = Math.floor(100000 + Math.random() * 900000).toString();
		user.twoFactorCode = code;
		user.twoFactorExpires = new Date(Date.now() + 5 * 60 * 1000);
		await AppDataSource.getRepository(User).save(user);
		await transporter.sendMail({
			from: '"Transcendance App" <guaglio.jordan@gmail.com>',
			to: user.email,
			subject: 'Votre code de connexion',
			text: `Votre code est : ${code}`
		});
	}


	async login(login: LoginDTO, fastify: FastifyInstance, redisClient: RedisClientType<Record<string, never>>) {
		const user = await AppDataSource.getRepository(User).findOne({
			where: { email: login.email }
		});
		if (!user)
			throw new Error('response.notFoundUser');
		const isValid = await bcrypt.compare(login.password, user.password);
		if (!isValid)
			throw new Error('response.notFoundUser');
		if (user.isTwoFactorEnabled)
			this.sendCode(user);
		else {
			user.login = true;
			await AppDataSource.getRepository(User).save(user);
			const jti = uuidv4()
			await redisClient.set(`activeSession:${user.id}`, jti, { EX: 3600 });
			const token = fastify.jwt.sign({ id: user.id, email: user.email, jti });
			return ({ user: this.returnUser(user), token: token })
		}
		return null;
	}

	async checkState(id: number) {
		const user = await AppDataSource.getRepository(User).findOne({
			where: { id: id }
		});
		if (!user)
			throw Error("response.notFoundUser")
		return { state: user.login };
	}

	async checkCode(login: LoginDTO, code: string, fastify: FastifyInstance, redisClient: RedisClientType<Record<string, never>>) {
		console.log(login);
		const obj = Object.assign(new LoginDTO(), login);
		const errors = await validate(obj);
		if (errors.length > 0)
			throw new Error('response.invalidRequest');
		const user = await AppDataSource.getRepository(User).findOne({
			where: { email: login.email }
		});
		const now = new Date(Date.now());
		if (!user)
			throw new Error('response.notFoundUser');
		if (user.twoFactorCode != code)
			throw new Error('response.invalidCode');
		if (user.twoFactorExpires < now)
			throw new Error('response.expiredCode');
		user.login = true;
		await AppDataSource.getRepository(User).save(user);
		const jti = uuidv4()
		await redisClient.set(`activeSession:${user.id}`, jti, { EX: 3600 });
		const token = fastify.jwt.sign({ id: user.id, email: user.email, jti });
		return { user: this.returnUser(user), token: token };
	}

	async verify(token: string, fastify: FastifyInstance) {
		try {
			const payload = fastify.jwt.verify(token);
			return payload;
		} catch (err) {
			throw new Error('response.invalidToken');
		}
	}

	async patchUser(update: UpdateUserDTO, id: number) {
		try {
			const user = await AppDataSource.getRepository(User).update(id, update);
			if (user.affected === 0)
				throw new Error('response.notFoundUser');
		} catch (error: any) {
			if (error.code === "SQLITE_CONSTRAINT") {
				if (error.message.includes("username")) {
					throw new Error("response.existUsername");
				}
				if (error.message.includes("email")) {
					throw new Error("response.existEmail");
				}
				throw new Error("response.unique");
			}
			throw error;
		}
	}


	async deleteUser(id: number) {
		const result = await AppDataSource
			.getRepository(User)
			.delete({ id });
		if (result.affected === 0)
			throw Error('response.deleteUser')
		return {};
	}
}
