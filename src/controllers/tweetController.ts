import { Request, Response } from 'express';
import { Op } from 'sequelize';
import Tweet from '../models/tweet';
import User from '../models/user';
import Tag from '../models/tag';

export const createTweet = async (req: Request, res: Response) => {
    const { content } = req.body;
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
    }

    try {
        const tweet = Tweet.build({ content, userId });
        console.log(tweet, "Tweet details");

        await tweet.validate();

        const createdTweet = await tweet.save();

        const taggedUsernames = content.match(/@\w+/g);
        if (taggedUsernames) {
            const usernames = taggedUsernames.map((username: string) => username.slice(1)); // Remove "@" from the start

            const users = await User.findAll({
                where: {
                    username: {
                        [Op.in]: usernames
                    }
                }
            });

            const tags = users.map(user => {
                return Tag.build({
                    tweetId: createdTweet.id,
                    userId: user.id
                }).validate().then(() => ({
                    tweetId: createdTweet.id,
                    userId: user.id
                }));
            });

            const validTags = await Promise.all(tags);
            await Tag.bulkCreate(validTags);
        }

        res.status(201).json({ message: 'Tweet created successfully', tweet: createdTweet });
    } catch (err: any) {
        console.error('Error creating tweet:', err);
        res.status(500).json({ message: 'Error creating tweet', error: err.message });
    }
};

export const getTimeline = async (req: Request, res: Response) => {
    const userId = req.user?.id;

    try {
        const tweets = await Tweet.findAll({
            where: {
                [Op.or]: [
                    { userId },
                    { '$Tags.userId$': userId }
                ]
            },
            order: [['createdAt', 'DESC']],
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'username'],
                },
                {
                    model: Tag,
                    attributes: []
                }
            ],
        });

        res.status(200).json({ message: 'Timeline fetched successfully', tweets });
    } catch (err: any) {
        res.status(500).json({ message: 'Error fetching timeline', error: err.message });
    }
};

export const getPublicFeed = async (req: Request, res: Response) => {
    try {
        const tweets = await Tweet.findAll({
            order: [['createdAt', 'DESC']],
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'username'],
                },
            ],
        });

        res.status(200).json({ message: 'Public feed fetched successfully', tweets });
    } catch (err: any) {
        res.status(500).json({ message: 'Error fetching public feed', error: err.message });
    }
};

export const getTaggedTweets = async (req: Request, res: Response) => {
    const username = req.user?.username;

    try {
        const user = await User.findOne({ where: { username } });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const tweets = await Tweet.findAll({
            where: {
                '$Tags.userId$': user.id
            },
            order: [['createdAt', 'DESC']],
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'username'],
                },
                {
                    model: Tag,
                    attributes: []
                }
            ],
        });

        res.status(200).json({ message: 'Tagged tweets fetched successfully', tweets });
    } catch (err: any) {
        res.status(500).json({ message: 'Error fetching tagged tweets', error: err.message });
    }
};
