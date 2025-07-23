import { Router } from 'express';
import * as CommentController from './controller.js';
import checkAuth from '../../middlewares/checkAuth.js';

const router = Router();

router.post('/', checkAuth, CommentController.create);
router.get('/posts/:postId/comments', CommentController.getById);
router.delete('/:id', checkAuth, CommentController.deleteById);

export { router };