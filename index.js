import express from "express";
import mongoose from "mongoose";
import { registerValidation, loginValidation } from "./validations/auth.js";
import { postCreateValidation } from "./validations/post.js";
import { searchValidation } from "./validations/search.js";
import checkAuth from "./utils/checkAuth.js";
import * as UserController from "./controllers/UserController.js"
import * as PostController from "./controllers/PostController.js"

mongoose
    .connect('mongodb://127.0.0.1:27017/admin')
    .then(() => console.log("Db ok"))
    .catch((err) => console.log("db error: ", err))

const app = express();

app.use(express.json());

app.post("/auth/register", registerValidation, UserController.register)
app.post("/auth/login", loginValidation, UserController.login)
app.get("/auth/me", checkAuth, UserController.getMe)

app.post("/posts", checkAuth, postCreateValidation, PostController.create);
app.delete("/posts/:id", PostController.deleteById);
app.patch("/posts", PostController.update);
app.get("/posts", PostController.getAll);
app.get("/posts/:id", PostController.getById);
app.get("/posts", searchValidation, PostController.search);


app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log("Server OK");
});