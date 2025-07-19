export const catchAsync = (fn) => async (req, res, next) => {
    try {
        await fn(req, res, next);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Произошла ошибка" });
    }
};