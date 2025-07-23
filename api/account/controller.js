import UserModel from "../../models/User.js";
import { catchAsync } from "../../middlewares/catchAsync.js";

export const getById = catchAsync(async (req, res) => {
    const user = await UserModel.findById(req.params.id);

    if (!user) {
        return res.status(404).json({
            message: "Пользователь не найден"
        });
    }

    const { passwordHash, ...userData } = user._doc;
    res.json(userData);
});

export const update = catchAsync(async (req, res) => {
    const userId = req.params.id;

    if (userId !== req.userId) {
        return res.status(403).json({
            message: "Нет доступа"
        });
    }

    const user = await UserModel.findByIdAndUpdate(
        userId,
        {
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl
        },
        { new: true }
    );

    if (!user) {
        return res.status(404).json({
            message: "Пользователь не найден"
        });
    }

    const { passwordHash, ...userData } = user._doc;
    res.json(userData);
});

export const getPostsByUser = catchAsync(async (req, res) => {
    const posts = await PostModel.find({ user: req.params.id })
        .sort({ createdAt: -1 })
        .populate('user');

    res.json(posts);
});