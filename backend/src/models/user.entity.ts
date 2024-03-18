import { Column, Entity, PrimaryGeneratedColumn  } from "typeorm";

@Entity()
export default class User {
  @PrimaryGeneratedColumn({ type:'bigint' })
  userId!: number;

  @Column({type: 'varchar', length: 50, unique: true})
  nick!: string;

  @Column({type: 'varchar', length: 25})
  password!: string;
}