import { Response, Request } from "express";
import { AppDataSoure } from "../models/dataSource";
import Expense from "../models/expense.entity";
import Target from "../models/target.entity";
import { Between, FindManyOptions } from "typeorm";

const expenseRepository = AppDataSoure.getRepository(Expense);
const targetRepository = AppDataSoure.getRepository(Target);

const withdraw = async (req: any, res: Response) => {
  try {
    const { id } = req.payload;
    const { amount, explanation, date, category } = req.body;

    const parsedAmount = parseFloat(amount);

    if (isNaN(parsedAmount)) {
      return res.status(400).json({ error: "액수는 유효한 숫자여야 합니다." });
    }

    if (parsedAmount >= 0) {
      return res.status(400).json({ error: "음수 값을 적어야 합니다." });
    }

    const newDeposit = new Expense();
    newDeposit.userId = id;
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
    return res
      .status(500)
      .json({ error: "가계부를 입력하는 동안 문제가 생겼습니다." });
  }
};

async function calculateTotalIncome(parsedAmount) {
  const lastEntry = await expenseRepository.findOne({
    where: {},
    order: { date: "DESC" },
  });
  let currentTotal: number = 0;
  if (lastEntry && typeof lastEntry.total === "number") {
    currentTotal = lastEntry.total;
  }
  return currentTotal + parsedAmount;
}

async function updateTotalIncome(totalIncome: number) {
  const latestIncomeEntry = await expenseRepository.findOne({
    where: {},
    order: { date: "DESC" },
  });
  if (latestIncomeEntry) {
    latestIncomeEntry.total = totalIncome;
    await expenseRepository.save(latestIncomeEntry);
  }
}

const view_withdraw = async (req: any, res: Response) => {
  try {
    const { id } = req.payload;
    const { date } = req.params;

    const day = new Date(date).toISOString();

    const queryOptions: FindManyOptions = {
      where: { userId: id, date: day },
    };

    const dailyIncome = await expenseRepository.find(queryOptions);
    return res.status(200).json(dailyIncome);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "내역을 가져오는 동안 문제가 생겼습니다." });
  }
};

const target = async (req: any, res: Response) => {
  const { id } = req.payload;
  const { date } = req.params;
  const { target } = req.body;
  if (!target) {
    return res.status(400).json({ message: "목표금액을 입력해주세요." });
  }
  if (target >= 0) {
    return res.status(400).json({ message: "음수 값을 적어주세요" });
  }
  try {
    const newTarget = new Target();
    newTarget.userId = id;
    newTarget.targetAmount = target;
    newTarget.date = new Date(date);

    const t = await targetRepository.save(newTarget);
    return res.status(200).json(t);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "목표금액을 입력하는 동안 문제가 생겼습니다." });
  }
};

const view_target = async (req: any, res: Response) => {
  try {
    const { id } = req.payload;
    const { date } = req.params;

    const currentDate = new Date(date);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);

    const t = await targetRepository.findOne({
      where: {
        userId: id,
        date: Between(startDate, endDate),
      },
      order: {
        targetId: "DESC",
      },
    });
    return res.status(200).json(t);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "출금 목표금액을 불러오는 동안 문제가 생겼습니다." });
  }
};

export { withdraw, target, view_target, view_withdraw };
