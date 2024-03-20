import express, { Router } from "express";
import { deposit } from "../controller/income";

const router: Router = express.Router();

router.post('/deposit', deposit);

export default router;