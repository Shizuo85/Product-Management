import request from "supertest";
import { Types } from "mongoose";
import app from "../../app";

describe(`DELETE /product/delete/${process.env.PRODUCT_ID}`, () => {
    it("should not delete product if jwt is not provided", async () => {
        const response = await request(app)
            .delete(`/api/v1/product/delete/${process.env.PRODUCT_ID}`);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty(
            "error",
            "Bad request, token missing"
        );
    });

    it("should not delete product if wrong but vaild jwt is passed", async () => {
        const response = await request(app)
            .delete(`/api/v1/product/delete/${process.env.PRODUCT_ID}`)
            .set("Authorization", `Bearer ${process.env.WRONG_TOKEN}`);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty(
            "error",
            "invalid token"
        );
    });

    it("should fail to delete product if an invalid jwt is passed", async () => {
        const response = await request(app)
            .delete(`/api/v1/product/delete/${process.env.PRODUCT_ID}`)
            .set("Authorization", `Bearer ${process.env.INVALID_TOKEN}`);

        expect([401, 400]).toContain(response.status);
        expect(response.body).toHaveProperty("error");
    });

    it("should fail to delete product if the product is not found", async () => {
        const response = await request(app)
            .delete(`/api/v1/product/delete/${new Types.ObjectId()}`)
            .set("Authorization", `Bearer ${process.env.TOKEN}`)

        expect([422, 404]).toContain(response.status);
        expect(response.body).toHaveProperty("error");
    });

    it("should delete product if the details are valid", async () => {
        const response = await request(app)
            .delete(`/api/v1/product/delete/${process.env.PRODUCT_ID}`)
            .set("Authorization", `Bearer ${process.env.TOKEN}`);

        expect(response.status).toBe(204);
    });
});
