import Joi from 'joi';

export const tweetValidationSchema = Joi.object({
    content: Joi.string().max(280).required(),
    userId: Joi.number().required(),
});
