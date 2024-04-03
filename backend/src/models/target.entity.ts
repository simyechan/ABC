import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class Target {
  @PrimaryGeneratedColumn({type:'bigint'})
  targetId!: number;

  @Column({ type: 'int', nullable: true })
  year?: number;

  @Column({ type: 'int', nullable: true })
  month?: number;

  @Column({type: 'int', default: 0})
  targetAmount!: number;
}