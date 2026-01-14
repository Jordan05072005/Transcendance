import { Entity, Column, PrimaryGeneratedColumn, Unique, Check } from 'typeorm';


@Entity()
@Unique(['iduser', 'idfriend'])
@Check(`"iduser" <> "idfriend"`)
export class Friend {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
	iduser!: number;

  @Column()
  idfriend!: number;
}

@Entity()
@Unique(['idreceiver', 'idsender'])
@Check(`"idreceiver" <> "idsender"`)
export class DataRequest {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
	idreceiver!: number;

  @Column()
  idsender!: number;
}