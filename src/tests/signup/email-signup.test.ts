import request from 'supertest';
import app from '../../app';

describe('POST /auth/signup', () => {
    it('should create a new user', async () => {
        const response = await request(app).post('/api/v1/auth/signup').send({
            email: 'ekeneath@icloud.com',
            password: 'Password.123$',
            confirmPassword: 'Password.123$',
            first_name: 'first_name',
            last_name: 'last_name'
        });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('data');
    });

    it('should not create a user with an invalid password', async () => {
        const response = await request(app).post('/api/v1/auth/signup').send({
            email: 'ekenea@icloud.com',
            password: 'password.123$',
        });

        expect(response.status).toBe(422);
        expect(response.body).toHaveProperty('error');
    });

    it('should not create a user with an invalid email', async () => {
        const response = await request(app).post('/api/v1/auth/signup').send({
            email: '',
            password: 'Password.123$',
        });

        expect(response.status).toBe(422);
        expect(response.body).toHaveProperty('error');
    });

    it('should not create a user which already exist', async () => {
        const response = await request(app).post('/api/v1/auth/signup').send({
            email: process.env.TEST_USER,
            password: 'Password.123$',
            confirmPassword: 'Password.123$',
            first_name: 'first_name',
            last_name: 'last_name'
        });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
    });
});
