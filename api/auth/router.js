import { Router } from 'express';
import { registerValidation, loginValidation } from '../validations/auth.js';
import * as UserController from '../controllers/UserController.js';
import checkAuth from '../middlewares/checkAuth.js';

const router = Router();

router.post('/register', registerValidation, UserController.register);
router.post('/login', loginValidation, UserController.login);
router.get('/me', checkAuth, UserController.getMe);

export { router };