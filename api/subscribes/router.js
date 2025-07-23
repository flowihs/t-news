import { Router } from 'express';
import * as SubscriptionController from './controller.js';
import checkAuth from '../../middlewares/checkAuth.js';

const router = Router();

router.post('/', checkAuth, SubscriptionController.subscribe);
router.delete('/', checkAuth, SubscriptionController.unsubscribe);
router.get('/:userId', SubscriptionController.getSubscriptions);

export { router };