import SubscriptionModel from "../../models/Subscribe.js";
import { catchAsync } from "../../middlewares/catchAsync.js";

export const subscribe = catchAsync(async (req, res) => {
    const { targetUserId } = req.body;

    const existingSubscription = await SubscriptionModel.findOne({
        subscriber: req.userId,
        targetUser: targetUserId
    });

    if (existingSubscription) {
        return res.status(400).json({
            message: "Вы уже подписаны на этого пользователя",
        });
    }

    const subscription = await SubscriptionModel.create({
        subscriber: req.userId,
        targetUser: targetUserId
    });

    res.status(201).json(subscription);
});

export const unsubscribe = catchAsync(async (req, res) => {
    const { targetUserId } = req.body;

    const subscription = await SubscriptionModel.findOneAndDelete({
        subscriber: req.userId,
        targetUser: targetUserId
    });

    if (!subscription) {
        return res.status(404).json({
            message: "Подписка не найдена",
        });
    }

    res.json({ message: "Вы отписались от пользователя" });
});

export const getSubscriptions = catchAsync(async (req, res) => {
    const subscriptions = await SubscriptionModel.find({
        subscriber: req.params.userId
    }).populate('targetUser');

    res.json(subscriptions);
});
