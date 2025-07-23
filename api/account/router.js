import { Router } from 'express';
import * as UserController from './controller.js';
import checkAuth from '../../middlewares/checkAuth.js';

const router = Router();

router.get('/:id', UserController.getById);
router.patch('/:id', checkAuth, UserController.update);
router.get('/:id/posts', UserController.getPostsByUser);

export { router };