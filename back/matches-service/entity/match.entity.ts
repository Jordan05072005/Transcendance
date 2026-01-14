import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('matches')
export class Match {
    @PrimaryGeneratedColumn()
    id!: number;

    @CreateDateColumn()
    startTime!: Date;

    @Column({ type: 'datetime', nullable: true })
    endTime?: Date;

    @Column()
    scorePlayer1!: number;

    @Column()
    scorePlayer2!: number;

    @Column()
    player1!: string;

    @Column()
    player1Id!: number;

    @Column({ nullable: true })
    player2?: string;

    @Column()
    player2Id!: number;

    @Column({ type: 'integer', nullable: true })
    winnerId?: number;
}