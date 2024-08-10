import request from 'supertest';
import app from '../../../app';
import sequelize from '../../../models/index';
import User from '../../../models/user';
import Tweet from '../../../models/tweet';
import Tag from '../../../models/tag';
beforeAll(async () => {
    await sequelize.sync({ force: true }); // Recreate the database schema
});

afterAll(async () => {
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0;'); // Disable foreign key checks
    await sequelize.query('TRUNCATE TABLE Tags;'); // Adjust table names as needed
    await sequelize.query('TRUNCATE TABLE Tweets;');
    await sequelize.query('TRUNCATE TABLE Users;');
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1;');


    await sequelize.close();
});

let token: string;

const signUpUser = async (username: string, email: string, password: string) => {
    await request(app)
        .post('/api/auth/signup')
        .send({ username, email, password });
};

const loginUser = async (email: string, password: string) => {
    const response = await request(app)
        .post('/api/auth/login')
        .send({ email, password });

    return response.body.token;
};

describe('Tweet Controller', () => {
    beforeAll(async () => {
        await signUpUser('testuser', 'test@example.com', 'password123');
        token = await loginUser('test@example.com', 'password123');
    });

    it('should create a new tweet', async () => {
        const response = await request(app)
            .post('/api/tweets')
            .set('Authorization', `Bearer ${token}`)
            .send({ content: 'Hello World! @testuser' });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('message', 'Tweet created successfully');
        expect(response.body).toHaveProperty('tweet');
    });

    it('should fetch a user\'s timeline', async () => {

        const response = await request(app)
            .get('/api/tweets/timeline')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Timeline fetched successfully');
        expect(response.body).toHaveProperty('tweets');
    });

    it('should fetch the public feed', async () => {
        await Tweet.create({ content: 'Public tweet!', userId: 1 });

        const response = await request(app)
            .get('/api/tweets/public-feed');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Public feed fetched successfully');
        expect(response.body).toHaveProperty('tweets');
    });

    it('should fetch tweets a user is tagged in', async () => {
        const response = await request(app)
            .get('/api/tweets/tagged')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Tagged tweets fetched successfully');
        expect(response.body).toHaveProperty('tweets');
    });
});