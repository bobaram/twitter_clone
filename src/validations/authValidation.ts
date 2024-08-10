import Joi from 'joi';

export const authValidationSchema = Joi.object({
    username: Joi.string().min(5).max(50).when('action', { is: 'signUp', then: Joi.required() }),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    action: Joi.string().valid('signUp', 'logIn').required(),
});
