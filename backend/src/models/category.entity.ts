import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import Income from "./income.entity";
import Expense from "./expense.entity";

@Entity()
export default class Category {
  @PrimaryGeneratedColumn({type:'bigint'})
  categoryId!: number

  @Column({type: 'varchar'})
  name!: string

  @OneToMany(() => Income, income => income.category)
  incomes!: Income[];

  @OneToMany(() => Expense, expense => expense.category)
  expenses!: Expense[];
}