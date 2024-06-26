import { Response, Request } from "express";
import { AppDataSoure } from "../models/dataSource";
import Income from "../models/income.entity";
import Goal from "../models/goal.entity";
import { Between, FindManyOptions } from "typeorm";

const incomeRepository = AppDataSoure.getRepository(Income);
const goalRepository = AppDataSoure.getRepository(Goal);

const deposit = async (req: any, res: Response) => {
  try {
    const { id } = req.payload;
    const { amount, explanation, date, category } = req.body;
    const day = new Date(date);

    const newDeposit = new Income();
    newDeposit.userId = id;
    newDeposit.amount = amount;
    newDeposit.explanation = explanation;
    newDeposit.date = day;
    newDeposit.category = category;

    const income = await incomeRepository.save(newDeposit);

    const totalIncome = await calculateTotalIncome(amount);

    await updateTotalIncome(totalIncome);

    return res.status(200).json(income);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "가계부를 입력하는 동안 문제가 생겼습니다." });
  }
};

async function calculateTotalIncome(amount) {
  const lastEntry = await incomeRepository.findOne({
    where: {},
    order: { date: "DESC" },
  });
  let currentTotal: number = 0;
  if (lastEntry && typeof lastEntry.total === "number") {
    currentTotal = lastEntry.total;
  }
  return currentTotal + amount;
}

async function updateTotalIncome(totalIncome: number) {
  const latestIncomeEntry = await incomeRepository.findOne({
    where: {},
    order: { date: "DESC" },
  });
  if (latestIncomeEntry) {
    latestIncomeEntry.total = totalIncome;
    await incomeRepository.save(latestIncomeEntry);
  }
}

const view_deposit = async (req: any, res: Response) => {
  try {
    const { id } = req.payload;
    const { date } = req.params;

    const day = new Date(date).toISOString();

    const queryOptions: FindManyOptions = {
      where: { userId: id, date: day },
    };

    const dailyIncome = await incomeRepository.find(queryOptions);
    return res.status(200).json(dailyIncome);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "내역을 가져오는 동안 문제가 생겼습니다." });
  }
};

const goal = async (req: any, res: Response) => {
  const { id } = req.payload;
  const { date } = req.params;
  const { goal } = req.body;
  if (!goal) {
    return res.status(400).json({ message: "목표금액을 입력해주세요." });
  }
  try {
    const newGoal = new Goal();
    newGoal.userId = id;
    newGoal.goalAmount = goal;
    newGoal.date = new Date(date);

    const g = await goalRepository.save(newGoal);
    return res.status(200).json(g);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "목표금액을 입력하는 동안 문제가 생겼습니다." });
  }
};

const view_goal = async (req: any, res: Response) => {
  try {
    const { id } = req.payload;
    const { date } = req.params;

    const currentDate = new Date(date);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);

    const g = await goalRepository.findOne({
      where: {
        userId: id,
        date: Between(startDate, endDate),
      },
      order: {
        goalId: "DESC",
      },
    });
    return res.status(200).json(g);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "입금 목표금액을 불러오는 동안 문제가 생겼습니다." });
  }
};

export { deposit, goal, view_goal, view_deposit };
