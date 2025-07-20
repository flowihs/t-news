import { Router } from "express";
import * as LikeController from "./controller.js";
import checkAuth from "../../middlewares/checkAuth.js";

const router = Router();

router.post("/", checkAuth, LikeController.toggleLike);
router.get("/", LikeController.getLikes);

export { router };