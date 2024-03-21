import { Response, Request } from "express"
import { AppDataSoure } from "../models/dataSource";
import Income from "../models/income.entity";
import Category from "../models/category.entity";

const incomeRepository = AppDataSoure.getRepository(Income);
const categoryRepository = AppDataSoure.getRepository(Category);

const deposit = async (req:Request, res:Response) => {
  try {
  const { amount, explanation, date, category } = req.body;

  let newcategory = await categoryRepository.findOne({ where : { name: category }})
  if (!newcategory) {
    newcategory = new Category();
    newcategory.name = category;
    newcategory = await categoryRepository.save(newcategory);
  }

  const newDeposit = new Income();
  newDeposit.amount = amount;
  newDeposit.explanation = explanation;
  newDeposit.date = date;
  newDeposit.category = newcategory;
  newDeposit.total += amount;

  const income = await incomeRepository.save(newDeposit);
  return res.status(200).json(income);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred while processing the request." });
  }
}

export { deposit };