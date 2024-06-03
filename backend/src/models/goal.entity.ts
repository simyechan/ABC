import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class Goal {
  @PrimaryGeneratedColumn({ type: "bigint" })
  goalId!: number;

  @Column({ type: "date" })
  date?: Date;

  @Column({ type: "int", default: 0 })
  goalAmount!: number;
}
