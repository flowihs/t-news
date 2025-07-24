import PostModel from "../../models/Post.js";
import { catchAsync } from "../../middlewares/catchAsync.js";
import SubscribeModel from "../../models/Subscribe.js";
import UserModel from "../../models/User.js";

export const create = catchAsync(async (req, res) => {
    const doc = new PostModel({
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        tags: req.body.tags,
        user: req.userId,
    });
    const post = await doc.save();
    res.json(post);
});

export const getAll = catchAsync(async (req, res) => {
    const posts = await PostModel.find().sort({ createdAt: -1 }).populate('user').exec();
    if (!posts?.length) {
        return res.status(404).json({ message: "Не удалось найти статьи" });
    }
    res.json(posts);
});

export const getById = catchAsync(async (req, res) => {
    const post = await PostModel.findById(req.params.id);
    if (!post) {
        return res.status(404).json({ message: "Статья не найдена" });
    }

    post.viewsCount += 1;
    await post.save();
    res.json(post);
});

export const deleteById = catchAsync(async (req, res) => {
    const post = await PostModel.findById(req.params.id);
    if (!post) {
        return res.status(404).json({ message: "Пост не найден" });
    }
    if (post.user.toString() !== req.userId) {
        return res.status(403).json({ message: "Нет прав для удаления этого поста" });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        await PostModel.findByIdAndDelete(req.params.id, { session });
        await CommentModel.deleteMany({ post: req.params.id }, { session });
        await LikeModel.deleteMany({ post: req.params.id }, { session });
        await session.commitTransaction();
        res.json({ message: "Пост и все связанные данные удалены" });
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
});

export const update = catchAsync(async (req, res) => {
    const post = await PostModel.findById(req.params.id);
    if (!post) {
        res.status(404).json({ message: "Статья не найдена" });
    }

    Object.assign(post, req.body);
    const updatedPost = await post.save();
    res.json(updatedPost);
});

export const getFeed = catchAsync(async (req, res) => {
    const subscriptions = await SubscribeModel.find({ subscriber: req.userId });
    const followingIds = subscriptions.map(s => s.targetUser);

    const posts = await PostModel.find({ user: { $in: followingIds } })
        .sort({ createdAt: -1 })
        .populate('user');

    res.json(posts);
});

export const search = catchAsync(async (req, res) => {
    const { q, type = 'post', page = 1, limit = 10 } = req.query;

    if (!q) {
        return res.status(400).json({ message: "Не указан поисковый запрос" });
    }

    if (type === 'post') {
        const result = await searchPosts(q, page, limit);
        return res.json(result);
    }
    else if (type === 'user') {
        const result = await searchUsers(q, page, limit);
        return res.json(result);
    }
    else {
        return res.status(400).json({ message: "Неподдерживаемый тип поиска" });
    }
});

const searchPosts = async (q, page, limit) => {
    const posts = await PostModel.find({
        $or: [
            { title: { $regex: q, $options: "i" }},
            { text: { $regex: q, $options: "i" }},
            { tags: { $in: [new RegExp(q, "i")] }},
        ]
    })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .populate("user")
        .exec();

    const count = await PostModel.countDocuments({
        $or: [
            { title: { $regex: q, $options: "i" }},
            { text: { $regex: q, $options: "i" }},
            { tags: { $in: [new RegExp(q, "i")] }},
        ]
    });

    return {
        type: 'post',
        results: posts,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
    };
};

const searchUsers = async (q, page, limit) => {
    const users = await UserModel.find({
        $or: [
            { name: { $regex: q, $options: "i" }},
            { bio: { $regex: q, $options: "i" }},
        ]
    })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

    const count = await UserModel.countDocuments({
        $or: [
            { name: { $regex: q, $options: "i" }},
            { bio: { $regex: q, $options: "i" }},
        ]
    });

    return {
        type: 'user',
        results: users,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
    };
};