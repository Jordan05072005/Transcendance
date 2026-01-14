import { IsBoolean, IsEmail, IsNumber, IsOptional, IsString } from "class-validator";

export class RequestDTO{
	@IsNumber()
	idreceiver!: number

	@IsNumber()
	idsender!: number
}

export class FriendDTO{
	@IsNumber()
	iduser!: number

	@IsNumber()
	idfriend!: number
}

export class FriendStateDTO{
	
	@IsString()
	username!:string

	@IsBoolean()
	login!:boolean
	
	@IsNumber()
	nbrVictory!:number
	
	@IsNumber()
	nbrDefeat!:number
}

export class RequestBodyDTO{
	@IsString()
	username!: string
}


