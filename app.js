import express from 'express';
import cors from 'cors';
import * as PostRouter from './api/auth/router.js';
import * as AuthRouter from './api/posts/router.js';
import * as LikesRouter from './api/likes/router.js';
import * as CommentsRouter from './api/comments/router.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', PostRouter.router);
app.use('/posts', AuthRouter.router);
app.use('/api/likes', LikesRouter.router);
app.use('/api/comments', CommentsRouter.router);

app.use((req, res) => {
    res.status(404).json({ message: 'Not Found' });
});

export default app;