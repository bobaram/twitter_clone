import { Router } from 'express';
import { createTweet, getTimeline, getPublicFeed, getTaggedTweets } from '../controllers/tweetController';
import authMiddleware from '../middleware/authMiddleware';

const router = Router();

router.post('/', authMiddleware, createTweet);
router.get('/timeline', authMiddleware, getTimeline);
router.get('/public-feed', getPublicFeed);
router.get('/tagged', authMiddleware, getTaggedTweets);

export default router;
