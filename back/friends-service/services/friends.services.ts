import axios from "axios";
import https from 'https';
import type { FriendDTO, FriendStateDTO, RequestDTO } from "../dto/user.dto.js";
import { AppDataSource } from "../data-source.js";
import { DataRequest, Friend } from "../entity/user.entity.js";
import type { DataStateUser, DataUserRequest } from "../types/fastify.js";
import { QueryFailedError } from "typeorm";

export class FriendsService {

	getagent() {
		const agent = new https.Agent({
			rejectUnauthorized: false,
		});
		return agent;
	}

	async addRequest(id: number, senderUsername: string, autori: string) {
		try {
			const response: DataUserRequest = await axios.get(`https://user-service:3001/users/by-username/${senderUsername}`, {
				headers: { Authorization: autori },
				httpsAgent: this.getagent()
			});
			await this.checkexistFriend(response.data.id, id);
			const request: RequestDTO = { idreceiver: response.data.id, idsender: id }
			const requestRepo = AppDataSource.getRepository(DataRequest);
			await requestRepo.save(request);
			return { state: "success" };
		} catch (error: any) {
			if (error instanceof QueryFailedError && (error as any).code === "SQLITE_CONSTRAINT") {
				const msg = (error as any).message;
				if (msg.includes("data_request.idreceiver, data_request.idsender")) {
					throw new Error("response.requestSend");
				}
				if (msg.includes('CHECK')) {
					throw new Error("response.requestYourself");
				}
			}
			if (error && (error as any).status === 404) {
				throw new Error(error.response.data.error);
			}
			if (error instanceof Error)
				throw new Error(error.message);
		}
	}

	async getRequest(id: number, autori: string) {
		try {
			const ids = await AppDataSource.getRepository(DataRequest).find({
				where: { idreceiver: id }
			});
			console.log(ids);
			if (!ids)
				throw Error("response.norequest");
			const users: string[] = [];
			for (let i = 0; i < ids.length; i++) {
				const user: DataUserRequest = await axios.get(`https://user-service:3001/users/by-id/${ids[i]?.idsender}`, {
					headers: { Authorization: autori },
					httpsAgent: this.getagent()
				});
				console.log(user.data);
				users.push(user.data.username || "");
			}
			return { users: users };
		} catch (error: any) {
			if (error instanceof QueryFailedError && (error as any).code === "SQLITE_CONSTRAINT") {
				const msg = (error as any).message;
				if (msg.includes("data_request.idreceiver, data_request.idsender")) {
					throw new Error("response.requestSend");
				}
				if (msg.includes('CHECK') && msg.includes('idreceiver') && msg.includes('idsender')) {
					throw new Error("response.requestYourself");
				}
			}
			throw error;
		}
	}

	async getFriend(id: number, autori: string) {
		try {
			const friends = await AppDataSource.getRepository(Friend).find({
				where: [
					{ idfriend: id },
					{ iduser: id },
				],
			});
			let useid;
			const data: FriendStateDTO[] = [];
			for (let i = 0; i < friends.length; i++) {
				useid = friends[i]?.idfriend;
				if (useid == id)
					useid = friends[i]?.iduser;
				const state: DataStateUser = await axios.get(`https://auth-service:3001/state/${useid}`, {
					headers: { Authorization: autori },
					httpsAgent: this.getagent()
				});
				const user: DataUserRequest = await axios.get(`https://user-service:3001/users/by-id/${useid}`, {
					headers: { Authorization: autori },
					httpsAgent: this.getagent()
				});
				data.push({
					login: state.data.state, username: user.data.username,
					nbrVictory: user.data.nbrVictory, nbrDefeat: user.data.nbrDefeat
				});
			}
			return ({ friends: data });
		} catch (error: any) {
			console.log(error);
			if (error instanceof QueryFailedError && (error as any).code === "SQLITE_CONSTRAINT") {
				const msg = (error as any).message;
				if (msg.includes("data_request.idreceiver, data_request.idsender")) {
					return { error: "response.friendSave" }
				}
				if (msg.includes('CHECK')) {
					throw new Error("response.requestYourself");
				}
			}
			throw error;
		}
	}

	async saveFriend(idreceiver: number, senderUsername: string, autori: string) {
		try {
			const idsender = await this.delRequest(idreceiver, senderUsername, autori);
			try {
				await this.delRequestid(idsender, idreceiver);
			}
			catch (error: any) { }
			const friendRepo = AppDataSource.getRepository(Friend);
			console.log("friendid : ", idreceiver)
			console.log("friendid : ", idsender)
			const request: FriendDTO = { iduser: idreceiver, idfriend: idsender };
			await friendRepo.save(request);
		} catch (error: any) {
			console.log(error);
			if (error instanceof QueryFailedError && (error as any).code === "SQLITE_CONSTRAINT") {
				const msg = (error as any).message;
				if (msg.includes("data_request.idreceiver, data_request.idsender")) {
					return { error: "response.friendSave" }
				}
				if (msg.includes('CHECK')) {
					throw new Error("response.requestYourself");
				}
			}
			throw error;
		}
	}

	async checkexistFriend(id1: number, id2: number) {
		try {
			const friendRepo = AppDataSource.getRepository(Friend);
			const existsFriend = await friendRepo.findOne({
				where: [
					{ iduser: id1, idfriend: id2 },
					{ iduser: id2, idfriend: id1 }
				]
			});
			if (existsFriend) {
				throw new Error("response.friendSave");
			}
		} catch (error: any) {
			if (error instanceof QueryFailedError && (error as any).code === "SQLITE_CONSTRAINT") {
				const msg = (error as any).message;
				if (msg.includes("data_request.idreceiver, data_request.idsender")) {
					return { error: "response.friendSave" }
				}
				if (msg.includes('CHECK') && msg.includes('idreceiver') && msg.includes('idsender')) {
					throw new Error("response.requestYourself");
				}
			}
			throw error;
		}
	}

	async delRequest(idreceiver: number, senderUsername: string, autori: string) {
		try {
			const response: DataUserRequest = await axios.get(`https://user-service:3001/users/by-username/${senderUsername}`, {
				headers: { Authorization: autori },
				httpsAgent: this.getagent()
			});
			const request: RequestDTO = { idreceiver: idreceiver, idsender: response.data.id }
			const requestRepo = AppDataSource.getRepository(DataRequest);
			const result = await requestRepo.delete(request);
			if (result.affected === 0)
				throw Error("response.requestNotFound")
			return (response.data.id);
		} catch (error: any) {
			throw error;
		}
	}

	async delRequestid(idreceiver: number, idsender: number) {
		try {
			const request: RequestDTO = { idreceiver: idreceiver, idsender: idsender }
			const requestRepo = AppDataSource.getRepository(DataRequest);
			const result = await requestRepo.delete(request);
			if (result.affected === 0)
				throw Error("response.requestNotFound")
		} catch (error: any) {
			throw error;
		}
	}

	async deleteFriend(id: number, senderUsername: string, autori: string) {
		try {
			const response: DataUserRequest = await axios.get(`https://user-service:3001/users/by-username/${senderUsername}`, {
				headers: { Authorization: autori },
				httpsAgent: this.getagent()
			});
			const friendRepo = AppDataSource.getRepository(Friend);
			// Try both directions since friendship can be stored either way
			const result1 = await friendRepo.delete({ iduser: id, idfriend: response.data.id });
			const result2 = await friendRepo.delete({ iduser: response.data.id, idfriend: id });
			// Success if at least one delete affected a row
			if ((result1.affected || 0) + (result2.affected || 0) === 0)
				throw Error("response.friendNotFound")
			return { state: "success" };
		} catch (error: any) {
			throw error;
		}
	}

	async deleteplayer(id: number) {
		try {
			console.log("deelete id : ", id)
			const friendRepo = AppDataSource.getRepository(Friend);
			const requestRepo = AppDataSource.getRepository(DataRequest);

			// Try both directions since friendship can be stored either way
			await friendRepo
				.createQueryBuilder()
				.delete()
				.where("iduser = :id", { id })
				.orWhere("idfriend = :id", { id })
				.execute();
			await requestRepo
				.createQueryBuilder()
				.delete()
				.where("idreceiver = :id", { id })
				.orWhere("idsender = :id", { id })
				.execute();
			return { state: "success" };
		} catch (error: any) {
			console.log(error);
			throw error;
		}
	}

}
