import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class Goal {
  @PrimaryGeneratedColumn({ type: "bigint" })
  goalId!: number;

  @Column({ type: "int", nullable: true })
  year?: number;

  @Column({ type: "int", nullable: true })
  month?: number;

  @Column({ type: "int", default: 0 })
  goalAmount!: number;
}
