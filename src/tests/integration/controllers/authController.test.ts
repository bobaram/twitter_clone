import request from 'supertest';
import app from '../../../app';
import User from '../../../models/user';
import sequelize from '../../../models/index';


beforeAll(async () => {
    await sequelize.sync({ force: true });
});

afterAll(async () => {
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0;');
    await sequelize.query('TRUNCATE TABLE Users;');
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1;');
    await sequelize.close();
});

describe('Auth Controller', () => {
    it('should sign up a new user', async () => {
        const response = await request(app)
            .post('/api/auth/signup')
            .send({
                username: 'testuser1',
                email: 'test@example.com',
                password: 'password123',
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('message', 'User created successfully');
        expect(response.body).toHaveProperty('user');
        expect(response.body.user).not.toHaveProperty('password');

    });

    it('should log in a user', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@example.com',
                password: 'password123',
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Logged in successfully');
        expect(response.body).toHaveProperty('token');
        expect(response.body).toHaveProperty('user');
        expect(response.body.user).not.toHaveProperty('password');
    });

    it('should return error for invalid credentials', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'nonexistent@example.com',
                password: 'wrongpassword',
            });

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message', 'User not found');
    });

    it('should return error for existing email', async () => {
        await request(app)
            .post('/api/auth/signup')
            .send({
                username: 'testuser2',
                email: 'unique@example.com',
                password: 'password123',
            });

        const response = await request(app)
            .post('/api/auth/signup')
            .send({
                username: 'anotheruser',
                email: 'unique@example.com',
                password: 'password123',
            });

        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('message', 'Email or username already taken');
    });
});
