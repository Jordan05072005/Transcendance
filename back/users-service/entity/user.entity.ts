import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class DataUser {
  @PrimaryGeneratedColumn()
  id!: number;

	@Column({unique: true})
	idauth!: number;

	@Column({ nullable: true })
	avatarPath?: string;
	
	@Column({ nullable: true })
  avatarMimeType?: string;

  @Column({unique: true})
  username!: string;

	@Column({unique: true})
  email!: string;

	@Column({ nullable: true })
	lang?: string;

	@Column()
	isTwoFactorEnabled!: boolean;

	@Column()
	nbrVictory!: number;
	
	@Column()
	nbrDefeat!: number;

	@Column()
	achivementVictory!: boolean;

	@Column()
	achivementLoss!: boolean;

	@Column()
	achivementDestroyer!: boolean;
}