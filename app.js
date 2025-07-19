import express from 'express';
import cors from 'cors';
import * as PostRouter from './api/auth/router.js';
import * as AuthRouter from './api/posts/router.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', PostRouter.router);
app.use('/posts', AuthRouter.router);

app.use((req, res) => {
    res.status(404).json({ message: 'Not Found' });
});

export default app;