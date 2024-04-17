import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, ManyToMany  } from "typeorm";
import Category from "./category.entity";
import User from "./user.entity";

@Entity()
export default class Income {
  @PrimaryGeneratedColumn({type:'bigint'})
  incomeId!: number

  @ManyToMany(() => Category, category => category.incomes)
  category!: Category

  @ManyToOne(() => User, user => user.userId)
  @Column({type: 'bigint', default: 1})
  userId!: number

  @Column({type: 'int', default: 0})
  amount!: number

  @Column({type: 'varchar', nullable: true})
  explanation?: string

  @Column({type: 'date'})
  date?: Date
  
  @Column({type: 'int', default: 0})
  total?: number
}