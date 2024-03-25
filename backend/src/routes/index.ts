import express, { Router } from 'express';
import auth from './auth';
import income from './income'
import expense from './expense'

const router:Router = express.Router();

router.use('/auth', auth);
router.use('/income', income);
router.use('/expense', expense);

export default router;