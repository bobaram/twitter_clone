import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import { authValidationSchema } from '../validations/authValidation';
import { Op } from 'sequelize';

export const signUp = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    try {
        await authValidationSchema.validateAsync({
            username,
            email,
            password,
            action: 'signUp'
        });
    } catch (err: any) {
        return res.status(400).json({ message: 'Validation failed', error: err.details });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const existingUser = await User.findOne({
            where: {
                [Op.or]: [{ email }, { username }]
            }
        });

        if (existingUser) {
            return res.status(500).json({
                message: 'Email or username already taken',
                error: 'Email or username already taken'
            });
        }

        const user = await User.create({ username, email, password: hashedPassword });
        const { password: _, ...userWithoutPassword } = user.toJSON();

        res.status(201).json({ message: 'User created successfully', user: userWithoutPassword });
    } catch (err) {
        res.status(500).json({ message: 'Error creating user', error: err });
    }
};

export const logIn = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        await authValidationSchema.validateAsync({
            email,
            password,
            action: 'logIn'
        });
    } catch (err: any) {
        return res.status(400).json({ message: 'Validation failed', error: err.details });
    }

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign(
            { id: user.id, email: user.email, username: user.username },
            process.env.JWT_SECRET!,
            { expiresIn: '1h' }
        );

        const { password: _, ...userWithoutPassword } = user.toJSON();

        res.json({ message: 'Logged in successfully', token, user: userWithoutPassword });
    } catch (err) {
        res.status(500).json({ message: 'Error logging in', error: err });
    }
};
