import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    bio: {
        type: String, default: ''
    },
    avatarUrl: String,
}, {
    timestamps: true, 
});

export default mongoose.model("User", UserSchema);