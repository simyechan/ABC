import { configDotenv } from 'dotenv'
import express, { Application, Request, Response } from 'express'
import { AppDataSoure } from './models/dataSource';
import cors from 'cors';
import router from './routes';

configDotenv();
const app: Application = express();
const port: number = Number(process.env.PORT) || 8000;

// // db설정
AppDataSoure.initialize()
    .then(() => { console.log(`DB has initted`) })
    .catch((err) => { console.error(err) });

// cors 설정
app.use(cors({
    origin: '*',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    credentials: true
}))

// 기본 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use('/', router);