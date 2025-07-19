import mongoose from 'mongoose';
import app from './app.js';

const PORT = process.env.PORT || 4444;
const DB_URI = process.env.DB_URI || 'mongodb://127.0.0.1:27017/blog';

const start = async () => {
    try {
        await mongoose.connect(DB_URI);
        console.log('MongoDB connected');

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('Server startup error:', err);
        process.exit(1);
    }
};

start();