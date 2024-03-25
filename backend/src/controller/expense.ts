import { Response, Request } from "express";
import { AppDataSoure } from "../models/dataSource";
import Expense from "../models/expense.entity";
import Category from "../models/category.entity";

const expenseRepository = AppDataSoure.getRepository(Expense);
const categoryRepository = AppDataSoure.getRepository(Category);

const withdraw = async (req:Request, res:Response) => {
  try {
    const { amount, explanation, date, category } = req.body;

    let newcategory = await categoryRepository.findOne({ where : { name: category }})
    if (!newcategory) {
      newcategory = new Category();
      newcategory.name = category;
      newcategory = await categoryRepository.save(newcategory);
    }

    const newWithdraw = new Expense();
    newWithdraw.amount = amount;
    newWithdraw.explanation = explanation;
    newWithdraw.date = date;
    newWithdraw.category = category;
    newWithdraw.total += amount;

    const expense = await expenseRepository.save(newWithdraw);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "가계부를 입력하는 동안 문제가 생겼습니다." });
  }
}

export { withdraw };