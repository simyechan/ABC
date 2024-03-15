import express, { Router } from 'express';
import { logIn } from '../controller/auth';
import { signUp } from '../controller/user';

const router: Router = express.Router();

router.post('/login', logIn);
router.post('/signup', signUp);

export default router;