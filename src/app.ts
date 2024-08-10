import express from 'express';
import authRoutes from './routes/authRoutes';
import tweetRoutes from './routes/tweetRoutes';

const app = express();

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tweets', tweetRoutes);

export default app;
