import request from 'supertest';
import app from '../../app';

describe('POST /auth/new-password', () => {
    it('should successfully reset a registered user password', async () => {
        const response = await request(app)
            .post('/api/v1/auth/new-password')
            .set('Authorization', `Bearer ${process.env.TOKEN}`)
            .send({
                newPassword: 'newPassword_43',
                confirmPassword: 'newPassword_43',
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty(
            'message',
            'Password reset successfully'
        );
    });

    it('should throw an error for an invalid input format', async () => {
        const response = await request(app)
            .post('/api/v1/auth/new-password')
            .set('Authorization', `Bearer ${process.env.TOKEN}`)
            .send({
                newPassword: 'newPassword_43',
                confirmPassword: 'new@Pass123',
            });

        expect(response.status).toBe(422);
        expect(response.body).toHaveProperty('error');
    });
});
