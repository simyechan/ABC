import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import User from "./user.entity";

@Entity()
export default class Target {
  @ManyToOne(() => User, (user) => user.userId)
  @Column({ type: "bigint" })
  userId!: number;

  @PrimaryGeneratedColumn({ type: "bigint" })
  targetId!: number;

  @Column({ type: "date" })
  date?: Date;

  @Column({ type: "int", default: 0 })
  targetAmount!: number;
}
