import { promises as fs } from 'fs';
import axios from "axios";
import { AppDataSource } from "../data-source.js";
import { DataUserDTO, UpdateDataUserDTO} from "../dto/user.dto.js";
import https from 'https';
import { DataUser } from "../entity/user.entity.js";
import type { MulterFile } from '../types/fastify.js';
import path from 'path';


export class UsersService {
	private readonly uploadDir = './uploads/avatars';

	constructor() {
		this.ensureUploadDir();
	}

	private async ensureUploadDir() {
		try {
			await fs.mkdir(this.uploadDir, { recursive: true });
		} catch (err) {
			console.error('Failed to create upload directory:', err);
		}
	}
	returnUser(user: DataUserDTO){
		const {idauth, ...returnuser } = user;
		if (user.avatarPath){
			const parts = user.avatarPath?.split('/');
			returnuser.avatarPath = `avatars/${parts[parts.length - 1]}`;
		}
		if (user.idauth)
			returnuser.id  = user.idauth; 
		return returnuser;
	}
	getagent(){
		const agent = new https.Agent({
					rejectUnauthorized: false,
		});
		return agent;
	}

	async getUser(iduser: number){
		const user = await AppDataSource.getRepository(DataUser).findOne({
				where: {idauth: iduser}
		});
		if (!user){
			throw Error('response.notFoundUser')
		}
		console.log(user);
		return {user: this.returnUser(user)};
	}

	async getUserByUsername(username: string){
		const user = await AppDataSource.getRepository(DataUser).findOne({
				where: {username: username}
		});
		if (!user){
			throw Error('response.notFoundUser')
		}
		return {id: user.idauth};
	}

	async deleteUserById(id: number, autori: string) {
		try{
			await axios.delete(`https://auth-service:3001/delete/${id}`,
			{
				headers: { Authorization: autori },
				httpsAgent: this.getagent()
			});
			await axios.delete(`https://friends-service:3001/player`,
			{
				headers: { Authorization: autori },
				httpsAgent: this.getagent()
			});
			const result = await AppDataSource
				.getRepository(DataUser)
				.delete({ id });
			if (result.affected === 0)
				throw Error('response.deleteUser')
			return {username: null, nbrVictory: -1, nbrDefeate: -1};
		}catch(error: any){
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
	}

	async getUserById(id: number){
		const user = await AppDataSource.getRepository(DataUser).findOne({
				where: {idauth: id}
		});
		if (!user){
			throw Error('response.notFoundUser')
		}
		return {username: user.username,
				nbrVictory: user.nbrVictory,
				nbrDefeat: user.nbrDefeat,
				achivementVictory: user.achivementVictory,
				achivementLoss: user.achivementLoss,
				achivementDestroyer: user.achivementDestroyer};
	}

	async setDataUser(datauser: DataUserDTO){
		try{
			datauser.nbrVictory = 0;
			datauser.nbrDefeat = 0;
			datauser.achivementVictory = false;
			datauser.achivementLoss = false;
			datauser.achivementDestroyer = false;
			datauser.lang = "en";
			const userRepo = AppDataSource.getRepository(DataUser);
			await userRepo.save(datauser);
		}catch(error: any){
			console.log(error)
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

	async patchUser(update: UpdateDataUserDTO, id: number, autori: string){
		let olduser;
		try{
			if (update.email != undefined || update.isTwoFactorEnabled != undefined || update.login != undefined){
				await axios.patch(`https://auth-service:3001/patch`, {
				email: update.email, isTwoFactorEnabled: update.isTwoFactorEnabled, login: update.login},{
					headers: { Authorization: autori },
					httpsAgent: this.getagent()
				});
			}
			olduser = (await this.getUser(id)).user;
			const {login, ...userdata} = update;
			const cleaned = Object.fromEntries(
			Object.entries(userdata).filter(([_, v]) => v !== undefined)
			);
			if (Object.keys(cleaned).length === 0) {
				return (this.getUser(id));
			}
			const user = await AppDataSource.getRepository(DataUser).update({ idauth: id }, userdata);
			if (user.affected === 0)
				throw new Error('response.notFoundUser');
			return (this.getUser(id));
		}catch(error: any){
			console.log(error);
			if (olduser != undefined)
				await AppDataSource.getRepository(DataUser).update(id, olduser);
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
	}

	async patchUserVictory(update: UpdateDataUserDTO, id: number, autori: string){
		let olduser;
		try{
			olduser = (await this.getUser(id)).user;

			const victoryCount = olduser.nbrVictory || 0
			const newVictoryCount = victoryCount + 1
			
			const user = await AppDataSource.getRepository(DataUser).update(
				{ idauth: id },
				{ nbrVictory: newVictoryCount});

			if (user.affected === 0)
				throw new Error('response.notFoundUser');
			return (this.getUser(id));
		}catch(error: any){
			console.log(error);
			throw error;
		}
	}

	async patchUserLoss(update: UpdateDataUserDTO, id: number, autori: string){
		let olduser;
		try{
			olduser = (await this.getUser(id)).user;

			const defeatCount = olduser.nbrDefeat || 0
			const newDefeatCount = defeatCount + 1
			
			const user = await AppDataSource.getRepository(DataUser).update(
				{ idauth: id },
				{ nbrDefeat: newDefeatCount});

			if (user.affected === 0)
				throw new Error('response.notFoundUser');
			return (this.getUser(id));
		}catch(error: any){
			console.log(error);
			throw error;
		}
	}

	async updateAvatar(userId: number, file: MulterFile): Promise<{ avatarUrl: string }> {
		if (!file.buffer) {
			throw new Error('response.fileBuff');
		}

		const fileExtension = path.extname(file.originalname);
		const uniqueName = file.originalname;
		const filePath = path.join(this.uploadDir, uniqueName);

		const user = await AppDataSource.getRepository(DataUser).findOne({ 
			where: { idauth: userId } 
		});
		if (!user) {
			throw new Error('response.notFoundUser');
		}

		if (user.avatarPath) {
			try {
				await fs.unlink(user.avatarPath);
			} catch (err) {
				console.error('Failed to delete old avatar:', err);
			}
		}
		
		await fs.writeFile(filePath, file.buffer);
		console.log('New avatar saved:', filePath);

		await AppDataSource.getRepository(DataUser).update(
			{ id: user.id },
			{
				avatarPath: filePath,
				avatarMimeType: file.mimetype
			}
		);
		const avatarUrl = `/avatars/${uniqueName}`;
		return { avatarUrl };
	}

	async getAvatarFile(filename: string): Promise<{
		buffer: Buffer;
		mimeType: string;
		stats: any;
	}> {
		if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
			throw new Error('response.invalidFilename');
		}

		const filePath = path.join(this.uploadDir, filename);

		try {
			const [buffer, stats] = await Promise.all([
				fs.readFile(filePath),
				fs.stat(filePath)
			]);

			const ext = path.extname(filename).toLowerCase();
			const mimeTypes: Record<string, string> = {
				'.jpg': 'image/jpeg',
				'.jpeg': 'image/jpeg',
				'.png': 'image/png',
				'.gif': 'image/gif',
				'.webp': 'image/webp',
				'.svg': 'image/svg+xml',
				'.bmp': 'image/bmp',
				'.ico': 'image/x-icon'
			};

			const mimeType = mimeTypes[ext] || 'application/octet-stream';

			return {
				buffer,
				mimeType,
				stats
			};
		} catch (err: any) {
			if (err.code === 'ENOENT') {
				throw new Error('response.avatarNotFound');
			}
			throw err;
		}
	}
}
