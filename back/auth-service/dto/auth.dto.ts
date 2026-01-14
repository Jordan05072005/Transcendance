import { IsBoolean, IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class SignUpDTO {

	@IsOptional()
	id?:number

  @IsString()
  username!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

	@IsOptional()
	twoFactorCode?: string;

	@IsOptional()
	twoFactorExpires?: Date;

	@IsBoolean()
	isTwoFactorEnabled!: boolean;

	@IsBoolean()
	@IsOptional()
 	login?: boolean;
}
export class UserDTO {
	@IsOptional()
	id?:number

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

	@IsOptional()
	twoFactorCode?: string;

	@IsOptional()
	twoFactorExpires?: Date;

	@IsBoolean()
	isTwoFactorEnabled!: boolean;

	@IsBoolean()
	@IsOptional()
 	login?: boolean;
}

export class UpdateUserDTO {
	@IsOptional()
  @IsString()
  username?: string;

  @IsEmail()
	@IsOptional()
  email?: string;

  @IsString()
  @MinLength(6)
	@IsOptional()
  password?: string;

	@IsBoolean()
	@IsOptional()
	isTwoFactorEnabled?: boolean;

	@IsBoolean()
	@IsOptional()
 	login?: boolean;
}

export class LoginDTO {
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;
}

export interface UserParams {
  id: string;
}