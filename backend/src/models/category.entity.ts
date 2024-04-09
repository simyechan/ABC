import { Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable } from "typeorm";
import Income from "./income.entity";
import Expense from "./expense.entity";

@Entity()
export default class Category {
  @PrimaryGeneratedColumn({type:'bigint'})
  categoryId!: number

  @Column({type: 'varchar'})
  name!: string

  @ManyToMany(() => Income, income => income.category)
  @JoinTable()
  incomes!: Income[];

  @ManyToMany(() => Expense, expense => expense.category)
  @JoinTable()
  expenses!: Expense[];
}