import { Column, Entity, PrimaryGeneratedColumn  } from "typeorm";

@Entity()
export default class Category {
  @PrimaryGeneratedColumn({type:'bigint'})
  categoryId!: number

  @Column({type: 'varchar'})
  name!: string
}