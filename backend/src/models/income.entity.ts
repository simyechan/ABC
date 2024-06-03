import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
} from "typeorm";
import User from "./user.entity";

enum Category {
  food = "음식",
  housing = "주거비(집세)",
  cloth = "의류/신발",
  traffic = "교통",
  medical = "의료",
  leisure = "여가/오락",
  communication = "통신",
  education = "교육",
  finance = "금융(대출)",
  household = "생활용품",
  health = "건강/미용",
  insurance = "보험",
  tax = "세금",
  family = "가족",
  travel = "여행/숙박",
  hobby = "취미/관심사",
  selfDevelopement = "자기 개발",
  invest = "투자",
  relationship = "대인 관계",
  etc = "기타",
}

@Entity()
export default class Income {
  @PrimaryGeneratedColumn({ type: "bigint" })
  incomeId!: number;

  @ManyToOne(() => User, (user) => user.userId)
  @Column({ type: "bigint", default: 1 })
  userId!: number;

  @Column({ type: "int", default: 0 })
  amount!: number;

  @Column({ type: "varchar", nullable: true })
  explanation?: string;

  @Column({ type: "date" })
  date?: Date;

  @Column({ type: "int", default: 0 })
  total?: number;

  @Column({ type: "enum", enum: Category, default: Category.etc })
  category!: Category;

  static getAllCategories(): string[] {
    const categories: string[] = [];
    for (const key in Category) {
      if (isNaN(Number(key))) {
        categories.push(Category[key]);
      }
    }
    return categories;
  }
}
