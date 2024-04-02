import express, { Router } from "express";
import { target, view_target, withdraw } from "../controller/expense";

const router: Router = express.Router();

router.post('/withdraw', withdraw);
router.post('/target', target);
router.get('/target', view_target);

export default router;