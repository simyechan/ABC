import express, { Router } from "express";
import { withdraw } from "../controller/expense";

const router: Router = express.Router();

router.post('/withdraw', withdraw);

export default router;