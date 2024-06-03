import express, { Router } from "express";
import {
  getCategory,
  getTotalForDate,
  getTotalForMonth,
} from "../controller/common";

const router: Router = express.Router();

router.get("/day", getTotalForDate);
router.get("/month/:date", getTotalForMonth);
router.get("/categorys", getCategory);

export default router;
