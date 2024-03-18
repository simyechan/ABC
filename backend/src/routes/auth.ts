import express, { Router } from 'express';
import { logIn, logOut } from '../controller/auth';
import { signUp } from '../controller/user';

const router: Router = express.Router();

router.post('/login', logIn);
router.post('/signup', signUp);
router.delete('/logout', logOut);


export default router;