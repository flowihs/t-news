import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import { catchAsync } from "../../middlewares/catchAsync.js";

import UserModel from "../../models/User.js";

export const register = catchAsync( async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json(errors.array());
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
        fullName: req.body.fullname,
        email: req.body.email,
        passwordHash: hash,
        avatarUrl: req.body.avatarUrl,
    });

    const user = await doc.save();

    const token = jwt.sign({
        _id: user._id,
    }, "secret123", { expiresIn: "30d" });

    const {passwordHash, ...userData} = user._doc;

    res.json({
        ...userData,
        token
    })
})


export const login = catchAsync( async (req, res) => {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
        return res.status(404).json({
            message: "Пользователь не найден",
        })
    }

    const isValidPass = await bcrypt.compare(req.body.password,
        user._doc.passwordHash);

    if (!isValidPass) {
        return res.status(400).json({
            message: "Неверный логин или пароль",
        })
    }

    const token = jwt.sign({
        _id: user.id,
    }, "secret123", { expiresIn: "30d" })

    const { passwordHash, ...userData } = user._doc;

    res.json({
        ...userData,
        token,
    })
})

export const getMe = catchAsync( async (req, res) => {
    const user = await UserModel.findById(req.userId);

    if (!user) {
        return res.status(404).json({
            message: "Пользователь не найден"
        });
    }

    const { passwordHash, ...userData } = user._doc;

    res.json({userData});
})
