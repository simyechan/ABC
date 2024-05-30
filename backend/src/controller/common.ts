import { Response, Request } from "express";
import { AppDataSoure } from "../models/dataSource";
import Expense from "../models/expense.entity";
import Income from "../models/income.entity";
import { Between } from "typeorm";

const incomeRepository = AppDataSoure.getRepository(Income);
const expenseRepository = AppDataSoure.getRepository(Expense);

const getTotalForDate = async (req: Request, res: Response) => {
  try {
    const { date } = req.query;
    
    if (!date) {
      return res.status(400).json({ error: "날짜를 찾을 수 없습니다." });
    }

    const startDate = new Date(date as string);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date as string);
    endDate.setHours(23, 59, 59, 999);

    const incomes = await incomeRepository.find({
      where: {
        date: Between(startDate, endDate)
      }
    });

    const expenses = await expenseRepository.find({
      where: {
        date: Between(startDate, endDate)
      }
    });

    return res.status(200).json({ incomes, expenses });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "특정 날짜의 수입과 지출을 불러오는 동안 문제가 생겼습니다." });
  }
};

const getTotalForMonth = async (req:Request, res:Response) => {
  try {
    const { year, month } = req.query;

    if (!month || !year) {
      return res.status(400).json({ error: "날짜를 찾을 수 없습니다." });
    }

    const startMonth = new Date(parseInt(year.toString()), parseInt(month.toString()) - 1, 1);
    const endMonth = new Date(parseInt(year.toString()), parseInt(month.toString()), 0);

    const incometotal = (await incomeRepository.find({
      where: {
        date: Between(startMonth, endMonth)
      }
    })).reduce((total, income) => total + income.amount, 0);
      
    const expensetotal = (await expenseRepository.find({
      where: {
        date: Between(startMonth, endMonth)
      }
    })).reduce((total, expense) => total + expense.amount, 0);

    return res.status(200).json({ total: incometotal + expensetotal || 0 });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "달의 총 금액을 불러오는 동안 문제가 생겼습니다." });
  }
}

const getCategory = async (req: Request, res: Response) => {
  try {

    const categories = Income.getAllCategories();
    
    return res.status(200).json(categories);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "카테고리를 불어오는 동안 문제가 생겼습니다." })
  }
}

export { getTotalForDate, getTotalForMonth, getCategory };
