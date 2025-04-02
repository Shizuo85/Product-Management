import request from 'supertest';
import app from '../../app';

describe('POST /auth/forgot-password', () => {
    it('should send a reset otp to the email if registered', async () => {
        const response = await request(app)
            .post('/api/v1/auth/forgot-password')
            .send({
                email: process.env.TEST_USER,
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('data');
        expect(response.body).toHaveProperty(
            'message',
            'A password reset email has been sent to your registered address.'
        );
    });

    it("should throw an error for an invalid input format", async () => {
        const response = await request(app).post("/api/v1/auth/forgot-password").send({
            email: "invalid email address"
        });

        expect(response.status).toBe(422);
        expect(response.body).toHaveProperty(
            "error",
            `\"email\" must be a valid email`
        );
    });
});
