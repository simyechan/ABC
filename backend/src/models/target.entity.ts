import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class Target {
  @PrimaryGeneratedColumn({ type: "bigint" })
  targetId!: number;

  @Column({ type: "date" })
  date?: Date;

  @Column({ type: "int", default: 0 })
  targetAmount!: number;
}
