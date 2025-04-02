import request from "supertest";
import { Types } from "mongoose";
import app from "../../app";

describe(`PATCH /product/edit/${process.env.PRODUCT_ID}`, () => {
    it("should not update product profile if jwt is not provided", async () => {
        const response = await request(app)
            .patch(`/api/v1/product/edit/${process.env.PRODUCT_ID}`)
            .send({
                name: `Product ${new Date()}`,
                category: 'shirts',
                variant: 'xxl',
                inventory: 12,
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty(
            "error",
            "Bad request, token missing"
        );
    });

    it("should not update product profile if wrong but vaild jwt is passed", async () => {
        const response = await request(app)
            .patch(`/api/v1/product/edit/${process.env.PRODUCT_ID}`)
            .set("Authorization", `Bearer ${process.env.WRONG_TOKEN}`)
            .send({
                name: `Product ${new Date()}`,
                category: 'shirts',
                variant: 'xxl',
                inventory: 12,
            });
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty(
            "error",
            "invalid token"
        );
    });

    it("should fail to update product profile if an invalid jwt is passed", async () => {
        const response = await request(app)
            .patch(`/api/v1/product/edit/${process.env.PRODUCT_ID}`)
            .set("Authorization", `Bearer ${process.env.INVALID_TOKEN}`)
            .send({
                name: `Product ${new Date()}`,
                category: 'shirts',
                variant: 'xxl',
                inventory: 12,
            });

        expect([401, 400]).toContain(response.status);
        expect(response.body).toHaveProperty("error");
    });

    it("should fail to update product profile if input validation fails", async () => {
        const response = await request(app)
            .patch(`/api/v1/product/edit/${process.env.PRODUCT_ID}`)
            .set("Authorization", `Bearer ${process.env.TOKEN}`)
            .send({
                name: `Product ${new Date()}`,
                category: 'shirts',
                variant: 'xxlx',
                inventory: [12],
            });

        expect([422, 400]).toContain(response.status);
        expect(response.body).toHaveProperty("error");
    });

    it("should fail to update product profile if the product is not found", async () => {
        const response = await request(app)
            .patch(`/api/v1/product/edit/${new Types.ObjectId()}`)
            .set("Authorization", `Bearer ${process.env.TOKEN}`)
            .send({
                name: `Product ${new Date()}`,
                category: 'shirts',
                variant: 'xxl',
                inventory: 12,
            });

        expect([422, 404]).toContain(response.status);
        expect(response.body).toHaveProperty("error");
    });

    it("should update product profile if the details are valid", async () => {
        const response = await request(app)
            .patch(`/api/v1/product/edit/${process.env.PRODUCT_ID}`)
            .set("Authorization", `Bearer ${process.env.TOKEN}`)
            .send({
                name: `Product ${new Date()}`,
                category: 'shirts',
                variant: 'xxl',
                inventory: 12,
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message");
    });
});
