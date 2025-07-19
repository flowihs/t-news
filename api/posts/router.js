import { Router } from 'express';
import * as PostController from './controller.js';
import { postCreateValidation } from '../../validations/post.js';
import { searchValidation } from "../../validations/search.js"
import checkAuth from '../../middlewares/checkAuth.js';

const router = Router();

router.post('/', checkAuth, postCreateValidation, PostController.create);
router.get('/', PostController.getAll);
router.get('/search', searchValidation, PostController.search);
router.get('/:id', PostController.getById);
router.patch('/:id', checkAuth, PostController.update);
router.delete('/:id', checkAuth, PostController.deleteById);

export { router };