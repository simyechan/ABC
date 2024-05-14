import { configDotenv } from "dotenv";
import { DataSource } from "typeorm";
import User from "./user.entity";
import Income from "./income.entity";
import Expense from "./expense.entity";
import 'reflect-metadata'
import Goal from "./goal.entity";
import Target from "./target.entity";

configDotenv();

export const AppDataSoure = new DataSource({
    type: "mysql",
    host: process.env.HOST,
    port: Number(process.env.PORT),
    username: process.env.USERNAME,
    database: process.env.NAME,
    password: process.env.PASSWORD,
    synchronize: true,
    logging: false,
    migrations: [],
    entities: [User, Income, Expense, Goal, Target],
    subscribers: [],
});