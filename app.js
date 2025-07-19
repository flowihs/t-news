import express from 'express';
import cors from 'cors';
import authRouter from './routes/authRouter.js';
import postsRouter from './routes/postsRouter.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRouter);
app.use('/posts', postsRouter);

app.use((req, res) => {
    res.status(404).json({ message: 'Not Found' });
});

app.use(errorHandler);

export default app;