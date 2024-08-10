import Joi from 'joi';

export const tagValidationSchema = Joi.object({
    tweetId: Joi.number().required(),
    userId: Joi.number().required(),
});
