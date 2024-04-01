import express, { Router } from "express";
import { deposit, goal, view_goal } from "../controller/income";

const router: Router = express.Router();

router.post('/deposit', deposit);
router.post('/goal', goal);
router.get('/goal', view_goal);

export default router;