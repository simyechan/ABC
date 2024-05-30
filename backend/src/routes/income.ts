import express, { Router } from "express";
import { deposit, goal, view_goal } from "../controller/income";
import { validationAccess } from "../controller/jwt";

const router: Router = express.Router();

router.post('/deposit', validationAccess, deposit);
router.post('/goal', validationAccess, goal);
router.get('/goal', validationAccess, view_goal);

export default router;