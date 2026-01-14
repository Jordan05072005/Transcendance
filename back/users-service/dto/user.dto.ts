import { IsBoolean, IsEmail, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';
import type { MulterFile } from '../types/fastify.js';

export class DataUserDTO {

	@IsOptional()
	id?:number

	@IsNumber()
	idauth?:number

	@IsOptional()
	avatarPath?:string

  @IsString()
  username!: string;

  @IsEmail()
  email!: string;

	@IsString()
	@IsOptional()
	lang?: string;

	@IsOptional()
	isTwoFactorEnabled?: boolean;

	@IsOptional()
	@IsNumber()
	nbrVictory?: number;

	@IsOptional()
	@IsNumber()
  nbrDefeat?: number;

  @IsOptional()
  achivementVictory?: boolean;

  @IsOptional()
  achivementLoss?: boolean;

  @IsOptional()
  achivementDestroyer?: boolean;
}

export class UpdateAvatarDTO{
	@IsOptional()
	avatar?:MulterFile | undefined
}


export class UpdateDataUserDTO {
	@IsOptional()
	avatar?:MulterFile | undefined

  @IsString()
	@IsOptional()
  username?: string;

  @IsEmail()
	@IsOptional()
  email?: string;

	@IsString()
	@IsOptional()
	lang?: string;

	@IsBoolean()
	@IsOptional()
	isTwoFactorEnabled?: boolean;

	@IsBoolean()
	@IsOptional()
	login?: boolean;

	@IsOptional()
	@IsNumber()
	nbrVictory?: number;

	@IsOptional()
	@IsNumber()
  	nbrDefeat?: number;

  @IsOptional()
  achivementVictory?: boolean;

  @IsOptional()
  achivementLoss?: boolean;

  @IsOptional()
  achivementDestroyer?: boolean;
}

