import PostModel from "../../models/Post.js";
import { catchAsync } from "../../middlewares/catchAsync.js";

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
    const post = await PostModel.findByIdAndDelete(req.params.id);
    if (!post) {
        return res.status(404).json({ message: "Статья не найдена" });
    }
    res.json({ message: "Статья удалена" });
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

export const search = catchAsync(async (req, res) => {
    const { q, page = 1, limit = 10 } = req.query;
    if (!q) {
        return res.status(400).json({
            message: "Не указан поисковый запрос",
        })
    }

    const posts = await PostModel.find({
        $or: [
            { title: { $regex: q, $options: "i" }},
            { text: { $regex: q, $options: "1" }},
            { tags: { $in: [new RegExp(q, "i")]}},
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
    })

    res.json({
        posts,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
    })
})