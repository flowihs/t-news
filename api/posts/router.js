import { Router } from 'express';
import * as PostController from '../controllers/PostController.js';
import { postCreateValidation, searchValidation } from '../validations/post.js';
import checkAuth from '../middlewares/checkAuth.js';

const router = Router();

router.post('/', checkAuth, postCreateValidation, PostController.create);
router.get('/', PostController.getAll);
router.get('/search', searchValidation, PostController.search);
router.get('/:id', PostController.getById);
router.patch('/:id', checkAuth, PostController.update);
router.delete('/:id', checkAuth, PostController.delete);

export { router };