import express, { Router } from "express";
import { getTotalForDate, getTotalForMonth } from "../controller/common";

const router: Router = express.Router();

router.get('/day', getTotalForDate);
router.get('/month', getTotalForMonth);

export default router;