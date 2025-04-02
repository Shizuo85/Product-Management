import request from 'supertest';
import app from '../../app';

describe('POST /auth/forgot-password/verify', () => {
    it('should verify a valid reset otp', async () => {
        const response = await request(app)
            .post('/api/v1/auth/forgot-password/verify')
            .query({
                token: process.env.TEST_TOKEN,
                otp: '857904',
            })

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('data');
        expect(response.body).toHaveProperty('message', 'Code verified');
    });

    it('should throw an error for an invalid input format', async () => {
        const response = await request(app)
            .post('/api/v1/auth/forgot-password/verify')
            .query({
                token: '',
                otp: '',
            })

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty(
            'error',
            'Token is invalid or has expired'
        );
    });

    it('should throw an error for an invalid input format', async () => {
        const response = await request(app)
            .post('/api/v1/auth/forgot-password/verify')
            .query({
                token: '',
                otp: '',
            });

        expect(response.status).toBe(422);
        expect(response.body).toHaveProperty('error');
    });
});
