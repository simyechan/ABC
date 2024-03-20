import { Column, Entity, PrimaryGeneratedColumn, ManyToOne  } from "typeorm";
import Category from "./category.entity";
import User from "./user.entity";

@Entity()
export default class Expense {
  @PrimaryGeneratedColumn({type:'bigint'})
  expenseId!: number

  @ManyToOne(() => Category, category => category.expenses)
  category!: Category

  @ManyToOne(() => User, user => user.userId)
  @Column({type: 'bigint'})
  userId!: number

  @Column({type: 'int', default: 0})
  amount!: number

  @Column({type: 'varchar'})
  explanation?: string

  @Column({type: 'date'})
  date?: Date

  @Column({type: 'int'})
  target?: number
}