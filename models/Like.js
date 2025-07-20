import mongoose from "mongoose";

const LikeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
    },
    // comment: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Comment"
    // },
    entityType: {
        type: String,
        enum: ["post", "comment"],
        required: true,
    }
}, { timestamps: true })

LikeSchema.index(
    { user: 1, post: 1, comment: 1 },
    { unique: true, partialFilterExpression: {
        $or: [{ post: { $exists: true }}, { comment: { $exists: true  }}]
    }}
)

export default mongoose.model("Like", LikeSchema);