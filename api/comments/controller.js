import CommentModel from "../../models/Comment.js";
import PostModel from "../../models/Post.js";
import { catchAsync } from "../../middlewares/catchAsync.js";

export const create = catchAsync(async (req, res) => {
    const { text, postId } = req.body;
    const userId = req.userId;

    const post = await PostModel.findById(postId);
    if (!post) {
        return res.status(404).json({ message: "Пост не найден:" });
    }

    const comment = await CommentModel.create({
        text,
        user: userId,
        post: postId,
    })

    res.status(201).json(comment);
})

export const getByPost = catchAsync(async (req, res) => {
    const { postId } = req.params;
    const comments = await CommentModel.find({ post: postId })
        .populate("user", "name avatar")
        .sort({ createdAt: -1 });

    res.json(comments);
})

export const deleteById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const userId = req.userId;

    const comment = await CommentModel.findById(id);
    if (!comment) {
        return res.status(404).json({ message: "Комментарий не найден" });
    }

    if (comment.user.toString() !== userId) {
        return res.status(403).json({ message: "Нет доступа" });
    }

    await CommentModel.findByIdAndDelete(id);
    res.json({ message: "Комментарий удален"});
})