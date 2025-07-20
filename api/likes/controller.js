import LikeModel from "../../models/Like.js";
import PostModel from "../../models/Post.js";
import CommentModel from '../../models/Comment.js';
import {catchAsync} from "../../middlewares/catchAsync.js";

export const toggleLike = catchAsync(async (req, res) => {
    const { entityType, entityId } = req.body;
    const userId = req.userId;

    let entityModel;
    if (entityType === "post") entityModel = PostModel;
    else if (entityType === "comment") entityModel = CommentModel;
    else return res.status(400).json({ message: "Неверный тип сущности "});

    const entity = await entityModel.findById(entityId);
    if (!entity) return res.status(404).json({ message: "Сущность не найдена" });

    const query = { user: userId, [entityType]: entityId };
    const existingLike = await LikeModel.findOne(query);

    if (existingLike) {
        await LikeModel.findByIdAndDelete(existingLike._id);
        await entityModel.findByIdAndUpdate(entityId, { $inc: {likesCount: -1} });
        return res.json({ liked: false });
    } else {
        const like = await LikeModel.create({
            user: userId,
            [entityType]: entityId,
            entityType,
        });
    }
    await entityModel.findByIdAndUpdate(entityId, { $inc: { likesCount: 1 }});
    return res.json({ liked: true, like });
})

export const getLikes = catchAsync(async (req, res) => {
    const { entityType, entityId } = req.query;
    const likes = await LikeModel.find({
        [entityType]: entityId,
        entityType,
    }).populate("user", "name avatar");
    res.json(likes);
})