import { Response, Request } from "express";
import { AppDataSoure } from "../models/dataSource";
import Expense from "../models/expense.entity";
import Target from "../models/target.entity";

const expenseRepository = AppDataSoure.getRepository(Expense);
const targetRepository = AppDataSoure.getRepository(Target);

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

    const newDeposit = new Expense();
    newDeposit.amount = parsedAmount;
    newDeposit.explanation = explanation;
    newDeposit.date = date;
    newDeposit.category = category;

    const income = await expenseRepository.save(newDeposit);

    const totalIncome = await calculateTotalIncome(parsedAmount);

    await updateTotalIncome(totalIncome);

    return res.status(200).json(income);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "가계부를 입력하는 동안 문제가 생겼습니다." });
  }
}

async function calculateTotalIncome(parsedAmount) {
  const lastEntry = await expenseRepository.findOne({ where: {}, order: { date: "DESC" } });
  let currentTotal: number = 0;
  if (lastEntry && typeof lastEntry.total === 'number') {
    currentTotal = lastEntry.total;
  }
  return currentTotal + parsedAmount;
}

async function updateTotalIncome(totalIncome: number) {
  const latestIncomeEntry = await expenseRepository.findOne({ where: {}, order: { date: "DESC" } });
  if (latestIncomeEntry) {
    latestIncomeEntry.total = totalIncome;
    await expenseRepository.save(latestIncomeEntry);
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
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    const newTarget = new Target();
    newTarget.targetAmount = target;
    newTarget.year = currentYear;
    newTarget.month = currentMonth;


    const t = await targetRepository.save(newTarget);
    return res.status(200).json(t);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "목표금액을 입력하는 동안 문제가 생겼습니다." })
  }
}

const view_target = async (req:Request, res:Response) => {
  try {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    const t = await targetRepository.findOne({ 
      where: {
        year : currentYear, 
        month : currentMonth
      },
      order: {
        targetId: "DESC"
      }
     });
     return res.status(200).json(t);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "출금 목표금액을 불러오는 동안 문제가 생겼습니다." })
  }
}

export { withdraw, target, view_target };