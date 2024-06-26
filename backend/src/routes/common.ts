import express, { Router } from "express";
import {
  getCategory,
  getTotalForDate,
  getTotalForMonth,
} from "../controller/common";
import { validationAccess } from "../controller/jwt";
import { getNick } from "../controller/user";

const router: Router = express.Router();

router.get("/day", validationAccess, getTotalForDate);
router.get("/month/:date", validationAccess, getTotalForMonth);
router.get("/categorys", getCategory);
router.get("/nick", validationAccess, getNick);

export default router;
