import express, { Router } from "express";
import { deposit, goal } from "../controller/income";

const router: Router = express.Router();

router.post('/deposit', deposit);
router.post('/goal', goal);

export default router;