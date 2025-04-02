import request from 'supertest';
import app from '../../app';

describe('POST /product/create', () => {
    it('should not create a product if jwt is not provided', async () => {
        const response = await request(app)
            .post('/api/v1/product/create')
            .send({
                name: `Product ${new Date()}`,
                category: 'shirts',
                variant: 'xxl',
                inventory: 12,
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty(
            'error',
            'Bad request, token missing'
        );
    });

    it('should not create a product if wrong but vaild jwt is passed', async () => {
        const response = await request(app)
            .post('/api/v1/product/create')
            .set('Authorization', `Bearer ${process.env.WRONG_TOKEN}`)
            .send({
                name: `Product ${new Date()}`,
                category: 'shirts',
                variant: 'xxl',
                inventory: 12,
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty(
            'error',
            'invalid token'
        );
    });

    it('should fail to create a product if an invalid jwt is passed', async () => {
        const response = await request(app)
            .post('/api/v1/product/create')
            .set('Authorization', `Bearer ${process.env.INVALID_TOKEN}`)
            .send({
                name: `Product ${new Date()}`,
                category: 'shirts',
                variant: 'xxl',
                inventory: 12,
            });

            expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
    });

    it('should fail to create a product if input validation fails', async () => {
        const response = await request(app)
            .post('/api/v1/product/create')
            .set('Authorization', `Bearer ${process.env.TOKEN}`)
            .send({
                name: `Product ${new Date()}`,
                category: 'shirtrs',
                variant: 'xxlr',
                inventory: [12],
            });

        expect([422, 400]).toContain(response.status);
        expect(response.body).toHaveProperty('error');
    });

    it('should create a product if the details are valid', async () => {
        const response = await request(app)
            .post('/api/v1/product/create')
            .set('Authorization', `Bearer ${process.env.TOKEN}`)
            .send({
                name: `Product ${new Date()}`,
                category: 'shirts',
                variant: 'xxl',
                inventory: 12,
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('message');
        expect(response.body).toHaveProperty('data');
    });
});
