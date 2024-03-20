import express, { Router } from 'express';
import auth from './auth';
import income from './income'

const router:Router = express.Router();

router.use('/auth', auth);
router.use('/income', income);

export default router;