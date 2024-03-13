import { Column, Entity, PrimaryGeneratedColumn, ManyToOne  } from "typeorm";
import Category from "./category.entity";
import User from "./user.entity";

@Entity()
export default class Income {
  @PrimaryGeneratedColumn({type:'bigint'})
  incomeId!: number

  @ManyToOne(() => Category, category => category.categoryId)
  @Column({type: 'bigint'})
  categoryId!: number

  @ManyToOne(() => User, user => user.userId)
  @Column({type: 'bigint'})
  userId!: number

  @Column({type: 'int', default: 0})
  amount!: number

  @Column({type: 'varchar'})
  default!: string

  @Column({type: 'date'})
  date?: Date

  @Column({type: 'int'})
  goal?: number
}