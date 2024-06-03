import express, { Router } from "express";
import {
  target,
  view_target,
  withdraw,
  view_withdraw,
} from "../controller/expense";
import { validationAccess } from "../controller/jwt";

const router: Router = express.Router();

router.post("/withdraw", validationAccess, withdraw);
router.get("/withdraw/:date", validationAccess, view_withdraw);
router.post("/target", validationAccess, target);
router.get("/target", validationAccess, view_target);

export default router;
