import { Response, Request } from "express";
import { AppDataSoure } from "../models/dataSource";
import Expense from "../models/expense.entity";
import Category from "../models/category.entity";

const expenseRepository = AppDataSoure.getRepository(Expense);
const categoryRepository = AppDataSoure.getRepository(Category);

const withdraw = async (req:Request, res:Response) => {
  try {
    const { amount, explanation, date, category } = req.body;

    const parsedAmount = parseFloat(amount);

    if (isNaN(parsedAmount)) {
      return res.status(400).json({ error: "액수는 유효한 숫자여야 합니다." });
    }

    if (parsedAmount >= 0) {
      return res.status(400).json({ error: "음수 값을 적어야 합니다." });
    }

    let newcategory = await categoryRepository.findOne({ where : { name: category }})
    if (!newcategory) {
      newcategory = new Category();
      newcategory.name = category;
      newcategory = await categoryRepository.save(newcategory);
    }

    const lastEntry = await expenseRepository.findOne({ where: {}, order: { date: "DESC" } });

    let currentTotal: number = 0;
    if (lastEntry && typeof lastEntry.total === 'number') {
      currentTotal = lastEntry.total;
    }
    const newWithdraw = new Expense();
    newWithdraw.amount = parsedAmount;
    newWithdraw.explanation = explanation;
    newWithdraw.date = date;
    newWithdraw.category = newcategory;
    newWithdraw.total = currentTotal + parsedAmount;

    const expense = await expenseRepository.save(newWithdraw);
    return res.status(200).json(expense);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "가계부를 입력하는 동안 문제가 생겼습니다." });
  }
}

const target = async (req:Request, res:Response) => {
  const { target } = req.body;
  if (!target) {
    return res.status(400).json({ message: "목표금액을 입력해주세요." });
  }
  if (target >= 0) {
    return res.status(400).json({ message: "음수 값을 적어주세요" });
  }
  try {
    const newTarget = new Expense();
    newTarget.target = target;

    const t = await expenseRepository.save(newTarget);
    return res.status(200).json(t);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "목표금액을 입력하는 동안 문제가 생겼습니다." })
  }
}

const view_target = async (req:Request, res:Response) => {
  try {
    const t = await expenseRepository.find({ select : ["target"] })
    res.json(t);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "출금 목표금액을 불러오는 동안 문제가 생겼습니다." })
  }
}

export { withdraw, target, view_target };