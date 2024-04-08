import express, { Router } from 'express';
import auth from './auth';
import income from './income'
import expense from './expense'
import common from './common'

const router:Router = express.Router();

router.use('/auth', auth);
router.use('/income', income);
router.use('/expense', expense);
router.use('/common', common);

export default router;