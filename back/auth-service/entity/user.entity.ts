import { ValidateIf } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

	@Column({unique: true})
  email!: string;

  @Column()
  password!: string;

	@Column()
  login!: boolean;

	@Column({ nullable: true })
	@ValidateIf(o => o.isTwoFactorEnabled)
	twoFactorCode?: string;

	@Column({ default: false })
	isTwoFactorEnabled!: boolean;

	@Column({ nullable: true })
	@ValidateIf(o => o.isTwoFactorEnabled)
	twoFactorExpires!: Date;
}