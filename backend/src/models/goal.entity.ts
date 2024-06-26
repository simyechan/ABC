import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import User from "./user.entity";

@Entity()
export default class Goal {
  @ManyToOne(() => User, (user) => user.userId)
  @Column({ type: "bigint" })
  userId!: number;

  @PrimaryGeneratedColumn({ type: "bigint" })
  goalId!: number;

  @Column({ type: "date" })
  date?: Date;

  @Column({ type: "int", default: 0 })
  goalAmount!: number;
}
