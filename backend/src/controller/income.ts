import { Response, Request } from "express"
import { AppDataSoure } from "../models/dataSource";
import Income from "../models/income.entity";
import Category from "../models/category.entity";
import Goal from "../models/goal.entity";

const incomeRepository = AppDataSoure.getRepository(Income);
const categoryRepository = AppDataSoure.getRepository(Category);
const goalRepository = AppDataSoure.getRepository(Goal);

const deposit = async (req:Request, res:Response) => {
  try {
    const { amount, explanation, date, category } = req.body;

    let newcategory = await categoryRepository.findOne({ where : { name: category }})
    if (!newcategory) {
      newcategory = new Category();
      newcategory.name = category;
      try {
        newcategory = await categoryRepository.save(newcategory);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: '카테고리를 저장하는 동안 문제가 발생했습니다.' });
      }
    }

    const newDeposit = new Income();
    newDeposit.amount = amount;
    newDeposit.explanation = explanation;
    newDeposit.date = date;
    newDeposit.category = newcategory;

    const income = await incomeRepository.save(newDeposit);

    const totalIncome = await calculateTotalIncome(amount);

    await updateTotalIncome(totalIncome);

    return res.status(200).json(income);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "가계부를 입력하는 동안 문제가 생겼습니다." });
  }
}

async function calculateTotalIncome(amount) {
  const lastEntry = await incomeRepository.findOne({ where: {}, order: { date: "DESC" } });
  let currentTotal: number = 0;
  if (lastEntry && typeof lastEntry.total === 'number') {
    currentTotal = lastEntry.total;
  }
  return currentTotal + amount;
}

async function updateTotalIncome(totalIncome: number) {
  const latestIncomeEntry = await incomeRepository.findOne({ where: {}, order: { date: "DESC" } });
  if (latestIncomeEntry) {
    latestIncomeEntry.total = totalIncome;
    await incomeRepository.save(latestIncomeEntry);
  }
}

const goal = async (req:Request, res:Response) => {
  const { goal } = req.body;
  if (!goal) {
    return res.status(400).json({ message: "목표금액을 입력해주세요." });
  }
  try {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    const newGoal = new Goal();
    newGoal.goalAmount = goal;
    newGoal.year = currentYear
    newGoal.month = currentMonth

    const g = await goalRepository.save(newGoal);
    return res.status(200).json(g);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "목표금액을 입력하는 동안 문제가 생겼습니다." })
  }
}

const view_goal = async (req:Request, res:Response) => {
  try {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    const g = await goalRepository.findOne({ 
      where: { 
        year : currentYear, 
        month : currentMonth 
      }, 
      order: { 
        goalId: "DESC" 
      }
    });
    return res.status(200).json(g);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "입금 목표금액을 불러오는 동안 문제가 생겼습니다." })
  }
}

export { deposit, goal, view_goal };