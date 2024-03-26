import express, { Router } from "express";
import { target, withdraw } from "../controller/expense";

const router: Router = express.Router();

router.post('/withdraw', withdraw);
router.post('/target', target);

export default router;